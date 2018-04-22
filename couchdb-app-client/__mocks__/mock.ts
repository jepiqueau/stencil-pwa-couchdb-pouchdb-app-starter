import { TestWindow } from '@stencil/core/testing';
const window: TestWindow = new TestWindow();
export const mockElement = (el:string): HTMLElement => {
    return window.document.createElement(el);
}
export const mockWindow = (): TestWindow => {
    return window;
}
export const mockDocument = (): Document => {
    let doc = window.document;
    doc.body.innerHTML = "";
    return doc;
}