const BaseModel = require("./baseModel");

class Dns {
    // constructor(id, zone_id, zone_name, name, type, content, proxiable, proxied, ttl, locked, meta, comment, tags, created_on, modified_on) {
    //     this.id = id;
    //     this.zone_id = zone_id;
    //     this.zone_name = zone_name;
    //     this.name = name
    //     this.type = type;
    //     this.content = content;
    //     this.proxiable = proxiable;
    //     this.proxied = proxied;
    //     this.ttl = ttl;
    //     this.locked = locked;
    //     this.meta = meta;
    //     this.comment = comment;
    //     this.tags = tags;
    //     this.created_on = created_on;
    //     this.modified_on = modified_on;
    // }
    constructor(data) {
        this.id = data.id;
        this.zone_id = data.zone_id;
        this.zone_name = data.zone_name;
        this.name = data.name
        this.type = data.type;
        this.content = data.content;
        this.proxiable = data.proxiable;
        this.proxied = data.proxied;
        this.ttl = data.ttl;
        this.locked = data.locked;
        this.meta = data.meta;
        this.comment = data.comment;
        this.tags = data.tags;
        this.created_on = data.created_on;
        this.modified_on = data.modified_on;
    }
}
class DnsWithBase extends BaseModel {
    constructor(dns) {
        super();
        Object.assign(this, dns);
    }
}

module.exports = { Dns, DnsWithBase };