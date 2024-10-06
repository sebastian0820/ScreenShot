"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Function to capture screenshot when button is clicked
const captureButton = document.getElementById('capture-button');
captureButton === null || captureButton === void 0 ? void 0 : captureButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    // Send request to main process to capture screenshot
    const filePath = yield electron_1.ipcRenderer.invoke('capture-screenshot');
    alert(`Screenshot saved at: ${filePath}`);
}));
//# sourceMappingURL=renderer.js.map