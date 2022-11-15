/* eslint-disable camelcase */
'use strict'

// eslint-disable-next-line one-var


var reqlib = require('app-root-path').require,
    OpenZWave = require('zwave-js'),
    inherits = require('util').inherits,
    EventEmitter = require('events'),
    debug = reqlib('./lib/debug')('Zwave')
    
const { exit } = require('process')
var emitters = require('./globalemitters')

debug.color = 6

const ZWAVE_STATUS = {
    0: 'driverReady',
    1: 'connected',
    2: 'scanDone',
    5: 'driverFailed',
    6: 'closed'
}

// https://github.com/OpenZWave/open-zwave/wiki/Adding-Devices#configuration-variable-types
const VAR_TYPES = {
    bool: v => Boolean(v),
    byte: v => parseInt(v),
    int: v => parseInt(v),
    short: v => parseInt(v),
    decimal: v => +v.toString().replace(',', '.'),
    string: null,
    raw: null,
    list: null,
    bitset: (v, valueId) => {
        valueId.value = parseInt(v)
        var binaryValue = v.toString(2)

        if (binaryValue.length < 8) {
            binaryValue = '0'.repeat(8 - binaryValue.length) + binaryValue
        }
        for (const bit in valueId.bitSetIds) {
            valueId.bitSetIds[bit].value =
                binaryValue.charAt(8 - parseInt(bit)) === '1'
        }
        return valueId.value
    }
}

// event
const EVENTS = {
    'driver':
    {
        'driver ready': driverReady,
        'all nodes ready': scanComplete,
        'error': driverFailed
    },
    'controller':
    {
        'node found': nodeFound,
        'node added': nodeAdded,
        'node removed': nodeRemoved,
        'inclusion failed': inclusionFailed,
        'exclusion failed': exclusionFailed

    },
    'node':
    {
        'alive': nodeAvailable,
        'ready': nodeReady,
        'node event': nodeEvent,
        'value added': valueAdded,
        'value updated': valueChanged,
        'value removed': valueRemoved,
        'value refreshed': valueChanged,
        'dead': nodeDead
    } 
}

// Status based on notification
const NODE_STATUS = {
    0: 'Initializing',
    3: 'Awake',
    4: 'Sleep',
    5: 'Dead',
    6: 'Alive'
}

let DRIVER;

/**
 * The constructor
 */
function ZwaveClient(config) {
    if (!(this instanceof ZwaveClient)) {
        return new ZwaveClient(config)
    }
    //EventEmitter.call(this)
    init.call(this, config)
}

//inherits(ZwaveClient, EventEmitter)

async function init(cfg) {
    this.inclusion = false
    this.exclusion = false
    this.cfg = cfg

    this.closed = false
    var options = {
        timeouts: {
            ack: 200,
            byte: 300,
            response: 500,
            sendDataCallback: 10000,
            serialAPIStarted: 10000
        },
        logConfig: cfg.logConfig,
        preferences: cfg.preferences ||
        {
            'temperature': "Celsius" // degres by default
        }
    } 


// secure connection todo

    cfg.NetworkKey = cfg.NetworkKey || process.env.OZW_NETWORK_KEY

    if (cfg.NetworkKey) {
        options.NetworkKey = cfg.NetworkKey.replace(/\s/g, '')
    }

    let DRIVER2 = new OpenZWave.Driver(cfg.port, options)
    if (cfg.plugin) {
        try {
            require(cfg.plugin)(this)
        } catch (error) {
            debug(`Error while loading ${cfg.plugin} plugin`, error.message)
        }
    }

    if (DRIVER) {
        let old_driver = DRIVER
        DRIVER = DRIVER2
        await old_driver.destroy()
        await DRIVER.start()
    } else {
        DRIVER = DRIVER2
    }
   
    DRIVER.client = this

    this.nodes = []
    this.zwcfg_nodes = {}
    this.devices = {}
    this.ozwConfig = {}
    this.healTimeout = null

    Object.keys(EVENTS.driver).forEach(function (evt) {
        onEvent.bind(DRIVER,evt)
        DRIVER.on(evt, EVENTS.driver[evt].bind(DRIVER))
    })  
 
}

// ---------- ZWAVE EVENTS -------------------------------------

// catch all events
function onEvent(name, ...args) {
    this.lastUpdate = Date.now()
    emitters.zwave.on('event', name, ...args)
}

async function driverReady() {
    const homeHex = '0x' + DRIVER.controller.homeId.toString(16)
    this.client.driverReadyStatus = true
    this.client.ozwConfig.homeid = DRIVER.controller.homeId
    this.client.ozwConfig.name = homeHex
    this.error = false
    this.status = ZWAVE_STATUS[0]

    // set controller event
    Object.keys(EVENTS.controller).forEach(function (evt) {
        onEvent.bind(DRIVER.controller, evt)
        DRIVER.controller.on(evt, EVENTS.controller[evt].bind(DRIVER.controller))
    })
    Object.keys(EVENTS.node).forEach(function (evt) {
        onEvent.bind(DRIVER.controller, evt)
        DRIVER.controller.on(evt, EVENTS.node[evt].bind(DRIVER.controller))
    })

    Object.keys(EVENTS.node).forEach(function (evt) {
        DRIVER.controller.nodes.forEach(function (node) {
            onEvent.bind(node, evt)
            node.on(evt, EVENTS.node[evt].bind(node))
        })
        
    })


    emitters.zwave.emit('zwave connection',DRIVER.client)
    debug('Scanning network with homeid:', DRIVER.client.ozwConfig.name)

}

function driverFailed(e) {
    this.client.error = 'Driver failed'
    this.client.status = ZWAVE_STATUS[5]
    debug('Driver failed', this.client.ozwConfig)
    debug('Driver error: ', e)
}

function connected(version) {
    this.client.ozwConfig.version = version
    debug('Zwave connected, Openzwave version:', version)
    this.client.status = ZWAVE_STATUS[1]

    this.emitEvent('CONNECTED', this.client.ozwConfig)
}

function nodeDead(ozwnode) {
    // removedead node
    DRIVER.controller.removeFailedNode(ozwnode.id)
    
}

function inclusionFailed() {
    this.emit('nogociate node',
        {
            'nodeId': null,
            'type': 'Inclusion',
            'status': 'Failed',
            'msg': 'roll failed'
        }
    )
}

function exclusionFailed() {
    this.emit('nogociate node',
        {
            'nodeId': null,
            'type': 'Exclusion',
            'status': 'Failed',
            'msg': 'unroll failed'
        }
    )
}

function nodeRemoved(ozwnode) {
    // don't use splice here, nodeid equals to the index in the array
    var node = this.nodes[ozwnode.id]
    if (node) {
        this.nodes[ozwnode.id] = null
    }
    if (this.exclusion) {
        this.emit('nogociate node',
            {
                'nodeId': ozwnode.id,
                'type': 'Exclusion',
                'status': 'Success',
                'msg': 'node has been remove'
            }
        )
        this.exclusion = false
    }
    debug('Node removed', nodeid)

    emitters.zwave.emit('nodeRemoved', node)
}

// Triggered when a node is added
function nodeAdded(node) {
    let nodeId = node.id
    debug("add node ", nodeId)
    if (!this.nodes[nodeId]) {
        DRIVER.client.initNode(node)
    }
    debug('Node added', nodeId )
    
}

// Triggered when a node is added
function nodeFound(node) {
    let nodeId = node.id
    debug("add Found ", nodeId)
    if (!this.nodes[nodeid]) {
        DRIVER.client.initNode(node)
    }
    debug('Node Found', nodeId)

}

// Triggered after node added event when the node info are firstly loaded
// ATTENTION: Values not added yet here
function nodeAvailable(ozwnode) {
    if (ozwnode && !ozwnode.isControllerNode()) {
        if (ozwnode.productId) {
            DRIVER.controller.healNode(ozwnode.id)
        }
        emitters.zwave.emit('node available', ozwnode.id, getDeviceID(ozwnode), ozwnode.productType)
        debug(
            'node available %d uid %s AVAILABLE: %s - %s - (%s)',
            ozwnode.id,
            getDeviceID(ozwnode),
            ozwnode.manufacturerId,
            ozwnode.productId,
            ozwnode.productType || 'Unknown'
        )
    }
}

// Triggered after all values have been added
function nodeReady(node) {
    DRIVER.client.nodes[node.id] = {}
    if (node) {
        // When a node is added 'on fly' it never triggers 'node available'
        if (node.ready) {
            DRIVER.client.initNode(node)
        }
        emitters.zwave.emit('node ready', node)
        debug(
            'node %d ready: %s - %s (%s)',
            node.id,
            node.manufacturerId,
            node.productId,
            node.productType || 'Unknown'
        )
    }
}

// Triggered after node available event when a value is added
function valueAdded(node, valueId) {
    let ozwnode = node
    if (!ozwnode) {
        debug('ValueAdded: no such node: ' + node.id, 'error')
    } else {
        let metadata = getValueParam(ozwnode, valueId)
        let comclass = metadata.commandClass
        let value_uid = getValueID(ozwnode.id, metadata)
        if (comclass === 0x86 && metadata.endpoint === 2) {
            // application version
            ozwnode.version = value
        }

        // check if node is added as secure node
        if (comclass === 0x98 && metadata.endpoint === 0) {
            ozwnode.secure = value
        }

        // avoid changed value mesure to 0 on wake up device: to be check with not battery device
        if (ozwnode.status !== NODE_STATUS[3] || comclass !== 49 || valueId.endpoint !== 0) {
            if (comclass !== 114) {
                emitters.zwave.emit('value added', value_uid,
                    metadata, metadata.value, ozwnode.id, getDeviceID(ozwnode))
            }
        }
        
        
        debug('ValueAdded: %s %s %s', value_uid, metadata.commandClassName, metadata.value)
        debug('value meta: %s', getDeviceID(ozwnode) )
        

    }
}



// Triggered when a node is ready and a value changes
function valueChanged(node, valueId) {
    try { 
        var ozwnode = node
        var comclass = valueId.commandClass
        var metadata = getValueParam(ozwnode, valueId)
        var value_id = getValueID(ozwnode.id, metadata)
     
        if (!ozwnode) {
            debug('valueChanged: no such node: ' + ozwnode.id, 'error')
        } else {
            var oldst = valueId.prevValue
            if (ozwnode.ready && oldst != null) {
                debug(
                    `zwave node ${ozwnode.id}: changed: ${value_id}:${metadata.label}:${oldst} -> ${valueId.newValue}`
                )
                // avoid changed value mesure to 0 on wake up device: to be check with not battery device
                if (ozwnode.status !== NODE_STATUS[3] || comclass !== 49 || valueId.value !== 0 ) {
                    emitters.zwave.emit('value changed', value_id, metadata,
                        metadata.newValue, ozwnode.id, getDeviceID(ozwnode))
                }
            }

            // update last active timestamp
            ozwnode.lastActive = Date.now()
        }

        // check if node is added as secure node
        if (comclass === 0x98 && valueId.index === 0) {
            ozwnode.secure = valueId.newValue
            emitters.zwave.emit('nodeStatus', ozwnode)
        }
    } catch (error) {
        debug(
            `Error while change value ${valueId.newValue} on ${ozwnode.id}: ${error.message}`
        )
    }
}

function valueRemoved(nodeid, comclass, instance, index) {
    var ozwnode = this.client.nodes[nodeid]
    var value_id = getValueID({
        class_id: comclass,
        instance: instance,
        index: index
    })
    if (ozwnode.values[value_id]) {
        delete ozwnode.values[value_id]
        debug('ValueRemoved: %s from node %d', value_id, nodeid)
    } else {
        debug('ValueRemoved: no such node: ' + nodeid, 'error')
    }
}

function nodeEvent(nodeid, evtcode) {
    debug('node event', nodeid, evtcode)
    emitters.zwave.emit('nodeSceneEvent', 'node', this.nodes[nodeid], evtcode)
}


function notification(nodeid, notif, help) {
    var ozwnode = this.client.nodes[nodeid]
    switch (notif) {
        case 0: // message complete
        case 1: // timeout
        case 2: // nop
            break
        case 3: // awake
        case 4: // sleep
        case 5: // dead
        case 6: // alive
            // eslint-disable-next-line no-case-declarations
            const ready = notif !== 5
            // eslint-disable-next-line no-case-declarations
            const wasReady = ozwnode.ready

            if (ready || (!ready && wasReady)) {
                ozwnode.lastActive = Date.now()
            }

            ozwnode.status = NODE_STATUS[notif]
            ozwnode.ready = ready

            if (ozwnode.available) {
                emitters.zwave.emit('nodeStatus', ozwnode)
            }
    }

    debug('Notification from node %d: %s (%s)', nodeid, help, notif)
}

function scanComplete() {

    DRIVER.controller.nodes.forEach((node) => {
        if (!node.isControllerNode) {
            nodeReady(node)
        }
    });
    DRIVER.client.scanComplete = true

    DRIVER.client.status = ZWAVE_STATUS[2]

    var nodes = DRIVER.client.nodes.filter(node => node.ready)

    // get node information
    for (var i = 0; i < nodes.length; i++) {
        // DRIVER.client.getGroups(nodes[i].id) not yet develop
        if (!nodes[i].isControllerNode) {
            nodes[i].neighborns = DRIVER.controller.getNodeNeighbors(nodes[i].id)
            DRIVER.controller.nodes[nodes[i].id].refreshValues()
        }
    }


    /*if (this.cfg.saveConfig && typeof this.client.writeConfig === 'function') {
        this.client.writeConfig()
    }*/

    debug('Network scan complete. Found:', nodes.length, 'nodes')
    emitters.zwave.emit('scan complete', DRIVER.client)
    
}



// ------- Utils ------------------------

/**
 * Get the device id of a specific node
 *
 * @param {Object} ozwnode Zwave node Object
 * @returns A string in the format `<manufacturerId>-<productId>-<producttype>` that unique identify a zwave device
 */
function getDeviceID(ozwnode) {
    if (!ozwnode) return ''
    return `${parseInt(ozwnode.id)}-${parseInt(ozwnode.manufacturerId)}-${parseInt(
        ozwnode.productId
    )}-${parseInt(ozwnode.productType)}`
}


/**
 * Used to parse a valueId value based on value type
 *
 * @param {Object} valueId Zwave valueId object
 */
function getValueParam(ozwnode, valueId) {
    let value = ozwnode.getValue(valueId)
    let valuemeta = ozwnode.getValueMetadata(valueId)
    let metadata = {}
    metadata = Object.assign({},
        valueId,
        { "value": value },
        valuemeta)
    metadata['availablevalue'] = {}
    if (metadata.hasOwnProperty('states')) {
        metadata['availablevalue'] = metadata.states
        return metadata
    }

    if (metadata.hasOwnProperty('min')) {
        metadata['availablevalue'] = {
            'min': metadata.min,
            'max': metadata.max
        }
        return metadata
    }

    
    return metadata
}

/**
 * Get a valueId from a valueId object
 *
 * @param {Object} v Zwave valueId object
 * @returns The value id without node reference: `${v.class_id}-${v.instance}-${v.index}`
 */
function getValueID(nodeId ,v) {
    if (v.hasOwnProperty('endpoint')) {
        return `${nodeId}-${v.commandClass}-${v.endpoint}-${v.property}`
    } else {
        return `${nodeId}-${v.commandClass}-${v.format}-${v.property}`
    }
}

/**
 * Function wrapping code used for writing queue.
 * fn - reference to function.
 * context - what you want "this" to be.
 * params - array of parameters to pass to function.
 */
function wrapFunction(fn, context, params) {
    return function () {
        fn.apply(context, params)
    }
}

/**
 * Deep copy of an object
 *
 * @param {*} obj The object to copy
 * @returns The copied object
 */
function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

// -------- Public methods --------------

/**
 * Used to get unique homeHex of driver
 */
Object.defineProperty(ZwaveClient.prototype, 'homeHex', {
    get: function () {
        return this.ozwConfig.name
    },
    enumerable: true
})

/**
 * Used to schedule next network heal at hours: cfg.healHours
 */
ZwaveClient.prototype.scheduleHeal = function () {
    if (!this.cfg.healNetwork) {
        return
    }

    var now = new Date()
    var start
    var hour = this.cfg.healHour

    if (now.getHours() < hour) {
        start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            0,
            0,
            0
        )
    } else {
        start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            hour,
            0,
            0,
            0
        )
    }

    var wait = start.getTime() - now.getTime()

    if (wait < 0) {
        this.scheduleHeal()
    } else {
        this.healTimeout = setTimeout(this.heal.bind(this), wait)
    }
}

/**
 * Calls client healNetwork function and schedule next heal
 *
 */
ZwaveClient.prototype.heal = function () {
    if (this.healTimeout) {
        clearTimeout(this.healTimeout)
        this.healTimeout = null
    }

    try {
        this.client.healNetwork()
        debug('Network auto heal started')
    } catch (error) {
        debug('Error while doing scheduled network heal', error.message)
    }

    // schedule next
    this.scheduleHeal()
}


/**
 * Method used to close client connection, use this before destroy
 */
ZwaveClient.prototype.close = function () {
    if (this.tail) {
        this.tail.unwatch()
    }

    this.status = ZWAVE_STATUS[6]

    if (this.commandsTimeout) {
        this.stopControllerCommand()
    }

    if (this.connected && this.client) {
        if (this.cfg.saveConfig && typeof this.client.writeConfig === 'function') {
            this.client.writeConfig()
        }
        this.connected = false
        this.closed = true

        if (this.healTimeout) {
            clearTimeout(this.healTimeout)
            this.healTimeout = null
        }

        this.client.removeAllListeners()    
        emitters.zwave.removeAllListeners()
        DRIVER.disconnect(this.cfg.port)
    }
}

ZwaveClient.prototype.getStatus = function () {
    var status = {}

    status.status = this.connected
    status.config = this.cfg

    return status
}

/**
 * Inits a Zwave node object with give nodeinfo object
 * Overrides `name` and `loc` properties and add node specific `hassDevices` using info stored in `nodes.json`
 * Calculates node `device_id`
 *
 * @param {Object} ozwnode The Node Zwave Object
 * @param {Object} nodeinfo Node Info Object
 */
ZwaveClient.prototype.initNode = async function (ozwnode) {
    var nodeid = ozwnode.id

    DRIVER.client.nodes[nodeid] = ozwnode

    for (let [key, valueid] of Object.entries(ozwnode.getDefinedValueIDs())) {
        let value =  getValueParam(ozwnode, valueid)
        let value_uid =  getValueID(ozwnode.id, valueid)
        if (value !== null) {
            emitters.zwave.emit('value added', value_uid,
                value, value.value , ozwnode.id, getDeviceID(ozwnode))
        }
    }
    DRIVER.client.nodes[nodeid].isControllerNode = ozwnode.isControllerNode
    DRIVER.client.nodes[nodeid].id = nodeid
    DRIVER.client.nodes[nodeid].lastActive = Date.now()

    for (var attrname in ozwnode) {
        // Use custom node naming and location
        if (attrname === 'name' || attrname === 'location') {
            ozwnode[attrname] = DRIVER.client.zwcfg_nodes[nodeid]
                ? DRIVER.client.zwcfg_nodes[nodeid][attrname]
                : ''
        }
    }
    
    if (!DRIVER.client.zwcfg_nodes[nodeid]) DRIVER.client.zwcfg_nodes[nodeid] = {}
    

    var deviceID = getDeviceID(ozwnode)
    DRIVER.client.nodes[nodeid].device_id = deviceID

    DRIVER.client.nodes[nodeid].basic_device_class = ozwnode.deviceClass.basic
    DRIVER.client.nodes[nodeid].generic_device_class = ozwnode.deviceClass.generic
    DRIVER.client.nodes[nodeid].specific_device_class = ozwnode.deviceClass.specific

    if (DRIVER.client.inclusion) {
        DRIVER.client.emit('nogociate node', {
            'nodeId': nodeid,
            'status': 'Complete',
            'msg' : 'enrolling success'
        })
        DRIVER.client.inclusion = false
    }


    debug('finished init node:', nodeid)
}

/**
 * Used to replace `null` nodes in nodes Array
 *
 */
ZwaveClient.prototype.addEmptyNodes = function () {
    for (var i = 0; i < this.nodes.length; i++) {
        if (!this.nodes[i]) {
            this.nodes[i] = {
                node_id: i,
                type: i === 0 ? 'Main controller' : '',
                status: i === 0 ? '' : 'Removed',
                name: this.zwcfg_nodes[i] ? this.zwcfg_nodes[i].name : '',
                loc: this.zwcfg_nodes[i] ? this.zwcfg_nodes[i].loc : '',
                failed: true,
                values: {}
            }
        }
    }
}

/**
 * Popolate node `groups` property by creating an array of groups `{text: <groupLabel>, value: <groupIndex>}`
 *
 * @param {Integer} nodeID Zwave node id
 */
ZwaveClient.prototype.getGroups = function (nodeID) {
    if (this.nodes[nodeID]) {
        var numGrups = this.client.getNumGroups(nodeID)
        for (var n = 0; n < numGrups; n++) {
            var label = this.client.getGroupLabel(nodeID, n + 1)
            this.nodes[nodeID].groups.push({
                text: label,
                value: n + 1
            })
        }
    }
}

/**
 * Refresh all nodes neighborns
 *
 * @returns The nodes array where `node_id` is the array index and the value is the array
 * of neighburns of that `node_id`
 */
ZwaveClient.prototype.refreshNeighborns = function () {
    for (let i = 0; i < this.nodes.length; i++) {
        if (!this.client.nodes[i].failed) {
            this.client.nodes[i].neighborns = DRIVE.controller.getNodeNeighbors(i)
        }
    }

    return this.nodes.map(n => n.neighborns)
}

/**
 * Method used to start Zwave connection using configuration `port`
 */
ZwaveClient.prototype.connect = async function () {
    if (!this.connected) {
        debug('Connecting to', this.cfg.port)
        await DRIVER.start()
        this.connected = true
    } else {
        debug('Client already connected to', this.cfg.port)
    }
}

/**
 *
 *
 * @param {String} evtName Event name
 * @param {Object} data Event data object
 */
ZwaveClient.prototype.emitEvent = function (evtName, data) {
    if (this.socket) {
        this.socket.emit(evtName, data)
    }
}

// ------------NODES MANAGEMENT-----------------------------------

/**
 * Updates node `name` property and stores updated config in `nodes.json`
 *
 * @param {Integer} nodeid Zwave node id
 * @param {String} name The node name
 * @returns True if the node name is updated correctly
 * @throws Invalid node id if the node id provided doesn't exists
 */
ZwaveClient.prototype._setNodeName = async function (nodeid, name) {
    if (!this.zwcfg_nodes[nodeid]) this.zwcfg_nodes[nodeid] = {}

    if (this.nodes[nodeid]) this.nodes[nodeid].name = name
    else throw Error('Invalid Node ID')

    this.zwcfg_nodes[nodeid].name = name

    await jsonStore.put(store.nodes, this.zwcfg_nodes)

    this.emit('nodeStatus', this.nodes[nodeid])

    return true
}

/**
 * Updates node `loc` property and stores updated config in `nodes.json`
 *
 * @param {Integer} nodeid Zwave node id
 * @param {String} loc The node name
 * @returns True if the node location is updated correctly
 * @throws Invalid node id if the node id provided doesn't exists
 */
ZwaveClient.prototype._setNodeLocation = async function (nodeid, loc) {
    if (!this.zwcfg_nodes[nodeid]) this.zwcfg_nodes[nodeid] = {}

    if (this.nodes[nodeid]) this.nodes[nodeid].loc = loc
    else throw Error('Invalid Node ID')

    this.zwcfg_nodes[nodeid].loc = loc

    await jsonStore.put(store.nodes, this.zwcfg_nodes)

    this.emit('nodeStatus', this.nodes[nodeid])

    return true
}


ZwaveClient.prototype.getNodes = function () {
    return this.nodes
}

ZwaveClient.prototype.getInfo = function () {
    var info = Object.assign({}, this.ozwConfig)

    info.uptime = process.uptime()
    info.lastUpdate = this.lastUpdate
    info.status = this.status
    info.cntStatus = this.cntStatus

    return info
}

ZwaveClient.prototype.startInclusion = async function (secure) {
    if (DRIVER && DRIVER.controller
        && !DRIVER.client.closed
        && !DRIVER.client.inclusion
        && DRIVER.client.scanComplete
    ) {
        DRIVER.client.inclusion = true
        if (DRIVER.client.commandsTimeout) {
            clearTimeout(DRIVER.client.commandsTimeout)
            DRIVER.client.commandsTimeout = null
        }

        DRIVER.client.commandsTimeout = setTimeout(
            () => {
                DRIVER.controller.stopInclusion.bind(DRIVER.client)
                if (DRIVER.client.inclusion = true) { 
                    this.emit('nogociate node',
                        {
                            'nodeId': null,
                            'status': 'Cancelled',
                            'type': 'Inclusion',
                            'msg': 'no node to add'
                        }
                    )
                    DRIVER.client.inclusion = false
                }
                debug("stop Inclusion")
            }
            ,
            DRIVER.client.cfg.commandsTimeout * 1000 || 30000
        )
        let InclusionOptions = {
            strategy: 0,
            forceSecurity: secure
        }
        await DRIVER.controller.beginInclusion()
        debug("start Inclusion")
    } else {
        this.emit('nogociate node',
            {
                'nodeId': null,
                'type': 'Inclusion',
                'status': 'Cancelled',
                'msg' : 'not ready to enroll command'
            }
        )
    }
}

ZwaveClient.prototype.startExclusion = function () {
    if (DRIVER && DRIVER.controller
        && !DRIVER.client.closed
        && !DRIVER.client.inclusion
        && DRIVER.client.scanComplete) {
        if (DRIVER.client.commandsTimeout) {
            clearTimeout(DRIVER.client.commandsTimeout)
            DRIVER.client.commandsTimeout = null
        }

        DRIVER.client.commandsTimeout = setTimeout(
            () => {
                DRIVER.client.driver.controller.stopExclusion.bind(DRIVER.client)
                this.emit('nogociate node',
                    {
                        'nodeId': null,
                        'type': 'Exclusion',
                        'status': 'Cancelled',
                        'msg': 'no node to remove'
                    }
                )
            },
            DRIVER.client.cfg.commandsTimeout * 1000 || 30000
        )
        this.driver.controller.beginExclusion()
        DRIVER.client.exclusion = true
    } else {
        this.emit('nogociate node',
            {
                'nodeId': null,
                'type': 'Exclusion',
                'status': 'Cancelled',
                'msg': 'not ready to unroll command'
            }
        )
    }
}

ZwaveClient.prototype.stopControllerCommand = async function () {
    if (this.client && !this.closed) {
        if (this.commandsTimeout) {
            clearTimeout(this.commandsTimeout)
            this.commandsTimeout = null
        }
        await this.client.cancelControllerCommand()
        this.inclusion = false
        this.exclusion = false
        
    }
}


/**
 * Set a value of a specific zwave valueId
 *
 * @param {Object} valueId Zwave valueId object
 * @param {Integer|String} value The value to send
 */
ZwaveClient.prototype.writeValue = function (nodeId, valueId, value) {
    if (this.connected
        && this.nodes[nodeId]
        && this.nodes[nodeId].ready) {
        try {
            this.nodes[nodeId].setValue(valueId, value)
        } catch (error) {
            debug(
                `Error while writing ${value} on ${valueId.value_id}: ${error.message}`
            )
        }
    }
}

module.exports = ZwaveClient