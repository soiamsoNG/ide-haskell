'use babel';
Object.defineProperty(exports, "__esModule", { value: true });
class MessageObject {
    constructor({ text, highlighter, html }) {
        this.text = text;
        this.highlighter = highlighter;
        this.html = html;
    }
    static fromObject(message) {
        if (typeof message === 'string') {
            return new MessageObject({ text: message });
        }
        else if (typeof message === 'object') {
            MessageObject.validate(message);
            return new MessageObject(message);
        }
    }
    static validate(message) {
        if (message.text && message.html)
            throw new Error('Can\'t have both text and html set');
        if (message.highlighter && !message.text)
            throw new Error('Must pass text when highlighter is set');
        if (!message.text && !message.html)
            throw new Error('Neither text nor html is set');
    }
    toHtml() {
        if (this.highlighter && this.text) {
            const html = require('atom-highlight')({
                fileContents: this.text,
                scopeName: this.highlighter,
                nbsp: false
            });
            if (html)
                return html;
            this.highlighter = null;
            return this.toHtml();
        }
        else if (this.html) {
            return this.html;
        }
        else {
            let div = document.createElement('div');
            div.innerText = this.text;
            return div.innerHTML;
        }
    }
    paste(element) {
        element.innerHTML = this.toHtml();
    }
}
exports.default = MessageObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS1vYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvbWVzc2FnZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOztBQUVYO0lBQ0UsWUFBYSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFFLE9BQU87UUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtRQUMzQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUMvQixNQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbkMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsUUFBUSxDQUFFLE9BQU87UUFDdEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO1FBQ3ZGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBO1FBQ25HLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDckYsQ0FBQztJQUVELE1BQU07UUFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3ZCLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDM0IsSUFBSSxFQUFFLEtBQUs7YUFDWixDQUFDLENBQUE7WUFDRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtZQUVyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ3RCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN2QyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7WUFDekIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUE7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFFRCxLQUFLLENBQUUsT0FBTztRQUNaLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ25DLENBQUM7Q0FDRjtBQTdDRCxnQ0E2Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlT2JqZWN0IHtcbiAgY29uc3RydWN0b3IgKHt0ZXh0LCBoaWdobGlnaHRlciwgaHRtbH0pIHtcbiAgICB0aGlzLnRleHQgPSB0ZXh0XG4gICAgdGhpcy5oaWdobGlnaHRlciA9IGhpZ2hsaWdodGVyXG4gICAgdGhpcy5odG1sID0gaHRtbFxuICB9XG5cbiAgc3RhdGljIGZyb21PYmplY3QgKG1lc3NhZ2UpIHtcbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IE1lc3NhZ2VPYmplY3Qoe3RleHQ6IG1lc3NhZ2V9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnKSB7XG4gICAgICBNZXNzYWdlT2JqZWN0LnZhbGlkYXRlKG1lc3NhZ2UpXG4gICAgICByZXR1cm4gbmV3IE1lc3NhZ2VPYmplY3QobWVzc2FnZSlcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgdmFsaWRhdGUgKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS50ZXh0ICYmIG1lc3NhZ2UuaHRtbCkgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGhhdmUgYm90aCB0ZXh0IGFuZCBodG1sIHNldCcpXG4gICAgaWYgKG1lc3NhZ2UuaGlnaGxpZ2h0ZXIgJiYgIW1lc3NhZ2UudGV4dCkgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHBhc3MgdGV4dCB3aGVuIGhpZ2hsaWdodGVyIGlzIHNldCcpXG4gICAgaWYgKCFtZXNzYWdlLnRleHQgJiYgIW1lc3NhZ2UuaHRtbCkgdGhyb3cgbmV3IEVycm9yKCdOZWl0aGVyIHRleHQgbm9yIGh0bWwgaXMgc2V0JylcbiAgfVxuXG4gIHRvSHRtbCAoKSB7XG4gICAgaWYgKHRoaXMuaGlnaGxpZ2h0ZXIgJiYgdGhpcy50ZXh0KSB7XG4gICAgICBjb25zdCBodG1sID0gcmVxdWlyZSgnYXRvbS1oaWdobGlnaHQnKSh7XG4gICAgICAgIGZpbGVDb250ZW50czogdGhpcy50ZXh0LFxuICAgICAgICBzY29wZU5hbWU6IHRoaXMuaGlnaGxpZ2h0ZXIsXG4gICAgICAgIG5ic3A6IGZhbHNlXG4gICAgICB9KVxuICAgICAgaWYgKGh0bWwpIHJldHVybiBodG1sXG5cbiAgICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSBudWxsXG4gICAgICByZXR1cm4gdGhpcy50b0h0bWwoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5odG1sKSB7XG4gICAgICByZXR1cm4gdGhpcy5odG1sXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgZGl2LmlubmVyVGV4dCA9IHRoaXMudGV4dFxuICAgICAgcmV0dXJuIGRpdi5pbm5lckhUTUxcbiAgICB9XG4gIH1cblxuICBwYXN0ZSAoZWxlbWVudCkge1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50b0h0bWwoKVxuICB9XG59XG4iXX0=