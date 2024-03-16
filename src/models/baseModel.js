class BaseModel {
    constructor() {
        this.isDelete = false;
        this.createTime = new Date();
        this.updateTime = new Date();
        this.isActive = true;
    }
}

module.exports = BaseModel;