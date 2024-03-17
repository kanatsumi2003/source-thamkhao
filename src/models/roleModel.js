const BaseModel = require('./baseModel');

class Role {
    constructor(Name, Description, isAdmin, listClaim) {
        this.name = Name.toLowerCase(); // Assuming you want to store the name
        this.description = Description; // Assuming you want to store a description
        this.isAdmin = isAdmin; // Boolean value to indicate if the user has admin privileges
        this.listClaim = listClaim; // Assuming this is an array or list of claims/rights
    }
}

class RoleWithBase extends BaseModel {
    constructor(role) {
        super();
        Object.assign(this, role);
    }
}

module.exports = { Role, RoleWithBase };   