const google_spreadsheet = require("./google-spreadsheet")
// @ponicode
describe("google_spreadsheet.getRowObjects", () => {
    test("0", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects("myDIV", "myDIV", "UPDATE Projects SET pname = %s WHERE pid = %s")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects("myDIV", "myDIV", "DELETE FROM Projects WHERE pid = %s")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects("myDIV", "myDIV", "UNLOCK TABLES;")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects("myDIV", "myDIV", "DROP TABLE tmp;")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects("myDIV", "myDIV", "SELECT * FROM Movies WHERE Title=’Jurassic Park’ AND Director='Steven Spielberg';")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            google_spreadsheet.getRowObjects(undefined, undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("google_spreadsheet.getSpreadsheetIdFromUrl", () => {
    test("0", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl("http://www.example.com/route/123?foo=bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl("http://base.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl("ponicode.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl("http://www.croplands.org/account/confirm?t=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl("https://twitter.com/path?abc")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            google_spreadsheet.getSpreadsheetIdFromUrl(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("google_spreadsheet.getWorksheetIdFromUrl", () => {
    test("0", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl("https://twitter.com/path?abc")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl("ponicode.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl("http://www.croplands.org/account/confirm?t=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl("Www.GooGle.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl("https://api.telegram.org/")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            google_spreadsheet.getWorksheetIdFromUrl(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
