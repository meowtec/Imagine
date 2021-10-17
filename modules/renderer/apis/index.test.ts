import * as index from "./index"
import * as types from "../../common/types"
// @ponicode
describe("index.fileAdd", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.fileAdd(["program.exe", "install.deb", "program.exe", "image.png", "install.deb"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            index.fileAdd(["script.py", "image.png", "script.py", "install.deb"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            index.fileAdd(["note.txt", "image.png"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            index.fileAdd(["install.deb", "install.deb", "program.exe"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            index.fileAdd(["image.png"])
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            index.fileAdd([])
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.fileSelect", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.fileSelect()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.fileSave", () => {
    test("0", () => {
        let param1: any = [{ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://croplands.org/app/a/confirm?t=", size: 10, ext: types.SupportedExt.webp, originalName: "Janet Homenick" }, { id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", url: "ponicode.com", size: 256, ext: types.SupportedExt.webp, originalName: "Ronald Keeling" }]
        let callFunction: any = () => {
            index.fileSave(param1, types.SaveType.OVER)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let param1: any = [{ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg", size: 10, ext: types.SupportedExt.webp, originalName: "Maurice Purdy" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "http://base.com", size: 256, ext: types.SupportedExt.webp, originalName: "Janet Homenick" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "Www.GooGle.com", size: 10, ext: types.SupportedExt.png, originalName: "Ronald Keeling" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://twitter.com/path?abc", size: 0, ext: types.SupportedExt.png, originalName: "Maurice Purdy" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://api.telegram.org/bot", size: 64, ext: types.SupportedExt.webp, originalName: "Janet Homenick" }]
        let callFunction: any = () => {
            index.fileSave(param1, types.SaveType.NEW_DIR)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let param1: any = [{ id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "Www.GooGle.com", size: 0, ext: types.SupportedExt.png, originalName: "Becky Bednar" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://accounts.google.com/o/oauth2/revoke?token=%s", size: 256, ext: types.SupportedExt.png, originalName: "Becky Bednar" }]
        let callFunction: any = () => {
            index.fileSave(param1, types.SaveType.NEW_NAME)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let param1: any = [{ id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", url: "www.google.com", size: 0, ext: types.SupportedExt.webp, originalName: "Ronald Keeling" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://croplands.org/app/a/confirm?t=", size: 32, ext: types.SupportedExt.webp, originalName: "Maurice Purdy" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://twitter.com/path?abc", size: 0, ext: types.SupportedExt.png, originalName: "Janet Homenick" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "https://api.telegram.org/", size: 10, ext: types.SupportedExt.png, originalName: "Becky Bednar" }, { id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", url: "https://", size: 32, ext: types.SupportedExt.webp, originalName: "Gail Hoppe" }]
        let callFunction: any = () => {
            index.fileSave(param1, types.SaveType.NEW_DIR)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let param1: any = [{ id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", url: "http://www.croplands.org/account/confirm?t=", size: 10, ext: types.SupportedExt.webp, originalName: "Becky Bednar" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "http://www.croplands.org/account/confirm?t=", size: 0, ext: types.SupportedExt.webp, originalName: "Ronald Keeling" }, { id: "7289708e-b17a-477c-8a77-9ab575c4b4d8", url: "https://croplands.org/app/a/confirm?t=", size: 64, ext: types.SupportedExt.png, originalName: "Becky Bednar" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "www.google.com", size: 256, ext: types.SupportedExt.png, originalName: "Gail Hoppe" }, { id: "a85a8e6b-348b-4011-a1ec-1e78e9620782", url: "http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg", size: 256, ext: types.SupportedExt.webp, originalName: "Becky Bednar" }]
        let callFunction: any = () => {
            index.fileSave(param1, types.SaveType.NEW_DIR)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            index.fileSave([], types.SaveType.SAVE_AS)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.fileSaveAll", () => {
    test("0", () => {
        let callFunction: any = () => {
            index.fileSaveAll(types.SaveType.OVER)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            index.fileSaveAll(types.SaveType.SAVE_AS)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            index.fileSaveAll(types.SaveType.NEW_DIR)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            index.fileSaveAll(types.SaveType.NEW_NAME)
        }
    
        expect(callFunction).not.toThrow()
    })
})
