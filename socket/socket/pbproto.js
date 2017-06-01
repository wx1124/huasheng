module.exports = require("protobufjs").newBuilder({})['import']({
    "package": "protobuf",
    "syntax": "proto2",
    "messages": [
        {
            "name": "User",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "required",
                    "type": "int32",
                    "name": "uid",
                    "id": 1,
                    "options": {
                        "default": 42
                    }
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "uname",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "pwd",
                    "id": 3
                }
            ]
        }
    ],
    "isNamespace": true
}).build();