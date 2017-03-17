Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("./utils");
class UPI {
    constructor(pluginManager) {
        this.pluginManager = pluginManager;
    }
    registerPlugin(disposables, name) {
        return new UPIInstance(this.pluginManager, disposables, name);
    }
}
exports.UPI = UPI;
class UPIInstance {
    constructor(pluginManager, disposables, pluginName) {
        this.pluginManager = pluginManager;
        this.pluginName = pluginName;
        disposables.add(this.disposables = new atom_1.CompositeDisposable());
    }
    setMenu(name, menu) {
        let menuDisp;
        this.disposables.add(menuDisp = atom.menu.add([{
                label: utils_1.MainMenuLabel,
                submenu: [{ label: name, submenu: menu }]
            }
        ]));
        return menuDisp;
    }
    setStatus(status) {
        return this.pluginManager.outputView.backendStatus(this.pluginName, status);
    }
    addMessages(messages, types) {
        messages = messages.map(function (m) {
            if (m.position != null) {
                m.position = atom_1.Point.fromObject(m.position);
            }
            return m;
        });
        return this.pluginManager.checkResults.appendResults(messages, types);
    }
    setMessages(messages, types) {
        messages = messages.map(function (m) {
            if (m.position != null) {
                m.position = atom_1.Point.fromObject(m.position);
            }
            return m;
        });
        return this.pluginManager.checkResults.setResults(messages, types);
    }
    clearMessages(types) {
        return this.pluginManager.checkResults.setResults([], types);
    }
    setMessageTypes(types) {
        return (() => {
            let result = [];
            for (let type in types) {
                let opts = types[type];
                result.push(this.pluginManager.outputView.createTab(type, opts));
            }
            return result;
        })();
    }
    onShouldShowTooltip(callback) {
        let disp;
        this.disposables.add(disp = this.pluginManager.onShouldShowTooltip(({ editor, pos, eventType }) => {
            return this.showTooltip({
                editor,
                pos,
                eventType,
                tooltip(crange) {
                    let res = callback(editor, crange, eventType);
                    if (res != null) {
                        return Promise.resolve(res);
                    }
                    else {
                        return Promise.reject({ ignore: true });
                    }
                }
            });
        }));
        return disp;
    }
    showTooltip({ editor, pos, eventType, detail, tooltip }) {
        let controller = this.pluginManager.controller(editor);
        return this.withEventRange({ controller, pos, detail, eventType }, ({ crange, pos, eventType }) => {
            return Promise.resolve(tooltip(crange)).then(({ range, text, persistOnCursorMove }) => controller.showTooltip(pos, range, text, { eventType, subtype: 'external', persistOnCursorMove }))
                .catch(status => {
                if (status == null) {
                    status = { status: 'warning' };
                }
                if (status instanceof Error) {
                    console.warn(status);
                    status = { status: 'warning' };
                }
                if (!status.ignore) {
                    controller.hideTooltip({ eventType });
                    return this.setStatus(status);
                }
            });
        });
    }
    onWillSaveBuffer(callback) {
        let disp;
        this.disposables.add(disp = this.pluginManager.onWillSaveBuffer(callback));
        return disp;
    }
    onDidSaveBuffer(callback) {
        let disp;
        this.disposables.add(disp = this.pluginManager.onDidSaveBuffer(callback));
        return disp;
    }
    onDidStopChanging(callback) {
        let disp;
        this.disposables.add(disp = this.pluginManager.onDidStopChanging(callback));
        return disp;
    }
    addPanelControl(element, opts) {
        return this.pluginManager.outputView.addPanelControl(element, opts);
    }
    addConfigParam(spec) {
        return this.pluginManager.addConfigParam(this.pluginName, spec);
    }
    getConfigParam(pluginName, name) {
        if (name == null) {
            name = pluginName;
            ({ pluginName } = this);
        }
        return this.pluginManager.getConfigParam(pluginName, name);
    }
    setConfigParam(pluginName, name, value) {
        if (value == null) {
            value = name;
            name = pluginName;
            ({ pluginName } = this);
        }
        return this.pluginManager.setConfigParam(pluginName, name, value);
    }
    withEventRange({ editor, detail, eventType, pos, controller }, callback) {
        if (pos != null) {
            pos = atom_1.Point.fromObject(pos);
        }
        if (eventType == null) {
            eventType = utils_1.getEventType(detail);
        }
        if (controller == null) {
            controller = this.pluginManager.controller(editor);
        }
        if (controller == null) {
            return;
        }
        return callback((controller.getEventRange(pos, eventType)));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3VwaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQWlEO0FBQ2pELG1DQUFxRDtBQUVyRDtJQUNFLFlBQWEsYUFBYTtRQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQTtJQUNwQyxDQUFDO0lBUUQsY0FBYyxDQUFFLFdBQVcsRUFBRSxJQUFJO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUMvRCxDQUFDO0NBQ0Y7QUFkRCxrQkFjQztBQUVEO0lBQ0UsWUFBYSxhQUFhLEVBQUUsV0FBVyxFQUFFLFVBQVU7UUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUE7UUFDbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDNUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFTRCxPQUFPLENBQUUsSUFBSSxFQUFFLElBQUk7UUFDakIsSUFBSSxRQUFRLENBQUE7UUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxFQUFFLHFCQUFhO2dCQUNwQixPQUFPLEVBQUUsQ0FBRSxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBQyxDQUFFO2FBQzFDO1NBQ0EsQ0FBQyxDQUFDLENBQUE7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQ2pCLENBQUM7SUFTRCxTQUFTLENBQUUsTUFBTTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFB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QU0sQ0FBQyxDQUFBO1FBQUMsQ0FBQztRQUM5RSxFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQTtRQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBQb2ludCB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBNYWluTWVudUxhYmVsLCBnZXRFdmVudFR5cGUgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY2xhc3MgVVBJIHtcbiAgY29uc3RydWN0b3IgKHBsdWdpbk1hbmFnZXIpIHtcbiAgICB0aGlzLnBsdWdpbk1hbmFnZXIgPSBwbHVnaW5NYW5hZ2VyXG4gIH1cblxuICAvKlxuICBDYWxsIHRoaXMgZnVuY3Rpb24gaW4gY29uc3VtZXIgdG8gZ2V0IGFjdHVhbCBpbnRlcmZhY2VcblxuICBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZSwgb25lIHlvdSB3aWxsIHJldHVybiBpbiBjb25zdW1lclxuICBuYW1lOiBQbHVnaW4gcGFja2FnZSBuYW1lXG4gICovXG4gIHJlZ2lzdGVyUGx1Z2luIChkaXNwb3NhYmxlcywgbmFtZSkge1xuICAgIHJldHVybiBuZXcgVVBJSW5zdGFuY2UodGhpcy5wbHVnaW5NYW5hZ2VyLCBkaXNwb3NhYmxlcywgbmFtZSlcbiAgfVxufVxuXG5jbGFzcyBVUElJbnN0YW5jZSB7XG4gIGNvbnN0cnVjdG9yIChwbHVnaW5NYW5hZ2VyLCBkaXNwb3NhYmxlcywgcGx1Z2luTmFtZSkge1xuICAgIHRoaXMucGx1Z2luTWFuYWdlciA9IHBsdWdpbk1hbmFnZXJcbiAgICB0aGlzLnBsdWdpbk5hbWUgPSBwbHVnaW5OYW1lXG4gICAgZGlzcG9zYWJsZXMuYWRkKHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpKVxuICB9XG5cbiAgLypcbiAgQWRkcyBuZXcgc3VtYmVudSB0byAnSGFza2VsbCBJREUnIG1lbnUgaXRlbVxuICBuYW1lIC0tIHN1Ym1lbnUgbGFiZWwsIHNob3VsZCBiZSBkZXNjcmlwdGl2ZSBvZiBhIHBhY2thZ2VcbiAgbWVudSAtLSBBdG9tIG1lbnUgb2JqZWN0XG5cbiAgUmV0dXJucyBEaXNwb3NhYmxlLlxuICAqL1xuICBzZXRNZW51IChuYW1lLCBtZW51KSB7XG4gICAgbGV0IG1lbnVEaXNwXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobWVudURpc3AgPSBhdG9tLm1lbnUuYWRkKFt7XG4gICAgICBsYWJlbDogTWFpbk1lbnVMYWJlbCxcbiAgICAgIHN1Ym1lbnU6IFsge2xhYmVsOiBuYW1lLCBzdWJtZW51OiBtZW51fSBdXG4gICAgfVxuICAgIF0pKVxuICAgIHJldHVybiBtZW51RGlzcFxuICB9XG5cbiAgLypcbiAgU2V0cyBiYWNrZW5kIHN0YXR1c1xuICBzdGF0dXMgLS0gb2JqZWN0XG4gICAgc3RhdHVzOiBvbmUgb2YgJ3Byb2dyZXNzJywgJ3JlYWR5JywgJ2Vycm9yJywgJ3dhcm5pbmcnXG4gICAgcHJvZ3Jlc3M6IGZsb2F0IGJldHdlZW4gMCBhbmQgMSwgb25seSByZWxldmFudCB3aGVuIHN0YXR1cyBpcyAncHJvZ3Jlc3MnXG4gICAgICAgICAgICAgIGlmIDAgb3IgdW5kZWZpbmVkLCBwcm9ncmVzcyBiYXIgaXMgbm90IHNob3duXG4gICovXG4gIHNldFN0YXR1cyAoc3RhdHVzKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFuYWdlci5vdXRwdXRWaWV3LmJhY2tlbmRTdGF0dXModGhpcy5wbHVnaW5OYW1lLCBzdGF0dXMpXG4gIH1cblxuICAvKlxuICBBZGQgbWVzc2FnZXMgdG8gaWRlLWhhc2tlbGwgb3V0cHV0XG4gIG1lc3NhZ2VzOiBBcnJheSBvZiBPYmplY3RcbiAgICB1cmk6IFN0cmluZywgRmlsZSBVUkkgbWVzc2FnZSByZWxhdGVzIHRvXG4gICAgcG9zaXRpb246IFBvaW50LCBvciBQb2ludC1saWtlIE9iamVjdCwgcG9zaXRpb24gdG8gd2hpY2ggbWVzc2FnZSByZWxhdGVzXG4gICAgbWVzc2FnZTogU3RyaW5nIG9yIHs8dGV4dCB8IGh0bWw+LCBoaWdobGlnaHRlcj99LCBtZXNzYWdlXG4gICAgc2V2ZXJpdHk6IFN0cmluZywgb25lIG9mICdlcnJvcicsICd3YXJuaW5nJywgJ2xpbnQnLCAnYnVpbGQnLFxuICAgICAgICAgICAgICBvciB1c2VyLWRlZmluZWQsIHNlZSBgc2V0TWVzc2FnZVR5cGVzYFxuICB0eXBlczogQXJyYXkgb2YgU3RyaW5nLCBjb250YWluaW5nIHBvc3NpYmxlIG1lc3NhZ2UgYHNldmVyaXR5YC4gSWYgdW5kZWZpbmVkLFxuICAgICAgICAgd2lsbCBiZSB0YWtlbiBmcm9tIGBtZXNzYWdlc2BcbiAgKi9cbiAgYWRkTWVzc2FnZXMgKG1lc3NhZ2VzLCB0eXBlcykge1xuICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMubWFwKGZ1bmN0aW9uIChtKSB7XG4gICAgICBpZiAobS5wb3NpdGlvbiAhPSBudWxsKSB7IG0ucG9zaXRpb24gPSBQb2ludC5mcm9tT2JqZWN0KG0ucG9zaXRpb24pIH1cbiAgICAgIHJldHVybiBtXG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5NYW5hZ2VyLmNoZWNrUmVzdWx0cy5hcHBlbmRSZXN1bHRzKG1lc3NhZ2VzLCB0eXBlcylcbiAgfVxuXG4gIC8qXG4gIFNldCBtZXNzYWdlcyBpbiBpZGUtaGFza2VsbCBvdXRwdXQuIENsZWFycyBhbGwgZXhpc3RpbmcgbWVzc2FnZXMgd2l0aFxuICBgc2V2ZXJpdHlgIGluIGB0eXBlc2BcbiAgbWVzc2FnZXM6IEFycmF5IG9mIE9iamVjdFxuICAgIHVyaTogU3RyaW5nLCBGaWxlIFVSSSBtZXNzYWdlIHJlbGF0ZXMgdG9cbiAgICBwb3NpdGlvbjogUG9pbnQsIG9yIFBvaW50LWxpa2UgT2JqZWN0LCBwb3NpdGlvbiB0byB3aGljaCBtZXNzYWdlIHJlbGF0ZXNcbiAgICBtZXNzYWdlOiBTdHJpbmcsIG1lc3NhZ2VcbiAgICBzZXZlcml0eTogU3RyaW5nLCBvbmUgb2YgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnbGludCcsICdidWlsZCcsXG4gICAgICAgICAgICAgIG9yIHVzZXItZGVmaW5lZCwgc2VlIGBzZXRNZXNzYWdlVHlwZXNgXG4gIHR5cGVzOiBBcnJheSBvZiBTdHJpbmcsIGNvbnRhaW5pbmcgcG9zc2libGUgbWVzc2FnZSBgc2V2ZXJpdHlgLiBJZiB1bmRlZmluZWQsXG4gICAgICAgICB3aWxsIGJlIHRha2VuIGZyb20gYG1lc3NhZ2VzYFxuICAqL1xuICBzZXRNZXNzYWdlcyAobWVzc2FnZXMsIHR5cGVzKSB7XG4gICAgbWVzc2FnZXMgPSBtZXNzYWdlcy5tYXAoZnVuY3Rpb24gKG0pIHtcbiAgICAgIGlmIChtLnBvc2l0aW9uICE9IG51bGwpIHsgbS5wb3NpdGlvbiA9IFBvaW50LmZyb21PYmplY3QobS5wb3NpdGlvbikgfVxuICAgICAgcmV0dXJuIG1cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hbmFnZXIuY2hlY2tSZXN1bHRzLnNldFJlc3VsdHMobWVzc2FnZXMsIHR5cGVzKVxuICB9XG5cbiAgLypcbiAgQ2xlYXIgYWxsIGV4aXN0aW5nIG1lc3NhZ2VzIHdpdGggYHNldmVyaXR5YCBpbiBgdHlwZXNgXG4gIFRoaXMgaXMgc2hvcnRoYW5kIGZyb20gYHNldE1lc3NhZ2VzKFtdLHR5cGVzKWBcbiAgKi9cbiAgY2xlYXJNZXNzYWdlcyAodHlwZXMpIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5NYW5hZ2VyLmNoZWNrUmVzdWx0cy5zZXRSZXN1bHRzKFtdLCB0eXBlcylcbiAgfVxuXG4gIC8qXG4gIFNldCBwb3NzaWJsZSBtZXNzYWdlIGBzZXZlcml0eWAgdGhhdCB5b3VyIHBhY2thZ2Ugd2lsbCB1c2UuXG4gIHR5cGVzOiBPYmplY3Qgd2l0aCBrZXlzIHJlcHJlc2VudGluZyBwb3NzaWJsZSBtZXNzYWdlIGBzZXZlcml0eWAgKGkuZS4gdGFiIG5hbWUpXG4gICAgICAgICBhbmQgdmFsdWVzIGJlaW5nIE9iamVjdHMgd2l0aCBrZXlzXG4gICAgdXJpRmlsdGVyOiBCb29sLCBzaG91bGQgdXJpIGZpbHRlciBhcHBseSB0byB0YWI/XG4gICAgYXV0b1Njcm9sbDogQm9vbCwgc2hvdWxkIHRhYiBhdXRvLXNjcm9sbD9cblxuICBUaGlzIGFsbG93cyB0byBkZWZpbmUgY3VzdG9tIG91dHB1dCBwYW5lbCB0YWJzLlxuICAqL1xuICBzZXRNZXNzYWdlVHlwZXMgKHR5cGVzKSB7XG4gICAgcmV0dXJuICgoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gW11cbiAgICAgIGZvciAobGV0IHR5cGUgaW4gdHlwZXMpIHtcbiAgICAgICAgbGV0IG9wdHMgPSB0eXBlc1t0eXBlXVxuICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBsdWdpbk1hbmFnZXIub3V0cHV0Vmlldy5jcmVhdGVUYWIodHlwZSwgb3B0cykpXG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSkoKVxuICB9XG5cbiAgLypcbiAgRWRpdG9yIGV2ZW50IHN1YnNjcmlwdGlvbi4gRmlyZXMgd2hlbiBtb3VzZSBjdXJzb3Igc3RvcHBlZCBvdmVyIGEgc3ltYm9sIGluXG4gIGVkaXRvci5cblxuICBjYWxsYmFjazogY2FsbGJhY2soZWRpdG9yLCBjcmFuZ2UsIHR5cGUpXG4gICAgZWRpdG9yOiBUZXh0RWRpdG9yLCBlZGl0b3IgdGhhdCBnZW5lcmF0ZWQgZXZlbnRcbiAgICBjcmFuZ2U6IFJhbmdlLCBjdXJzb3IgcmFuZ2UgdGhhdCBnZW5lcmF0ZWQgZXZlbnQuXG4gICAgdHlwZTogT25lIG9mICdtb3VzZScsICdzZWxlY3Rpb24nIC0tIHR5cGUgb2YgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhpc1xuXG4gICAgUmV0dXJucyB7cmFuZ2UsIHRleHR9IG9yIFByb21pc2UuXG4gICAgICByYW5nZTogUmFuZ2UsIHRvb2x0aXAgaGlnaGxpZ2h0aW5nIHJhbmdlXG4gICAgICB0ZXh0OiB0b29sdGlwIHRleHQuIFN0cmluZyBvciB7dGV4dCwgaGlnaGxpZ2h0ZXJ9IG9yIHtodG1sfVxuICAgICAgICB0ZXh0OiB0b29sdGlwIHRleHRcbiAgICAgICAgaGlnaGxpZ2h0ZXI6IGdyYW1tYXIgc2NvcGUgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaGlnaGxpZ2h0IHRvb2x0aXAgdGV4dFxuICAgICAgICBodG1sOiBodG1sIHRvIGJlIGRpc3BsYXllZCBpbiB0b29sdGlwXG5cbiAgcmV0dXJucyBEaXNwb3NhYmxlXG4gICovXG4gIG9uU2hvdWxkU2hvd1Rvb2x0aXAgKGNhbGxiYWNrKSB7XG4gICAgbGV0IGRpc3BcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChkaXNwID0gdGhpcy5wbHVnaW5NYW5hZ2VyLm9uU2hvdWxkU2hvd1Rvb2x0aXAoKHtlZGl0b3IsIHBvcywgZXZlbnRUeXBlfSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuc2hvd1Rvb2x0aXAoe1xuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHBvcyxcbiAgICAgICAgZXZlbnRUeXBlLFxuICAgICAgICB0b29sdGlwIChjcmFuZ2UpIHtcbiAgICAgICAgICBsZXQgcmVzID0gY2FsbGJhY2soZWRpdG9yLCBjcmFuZ2UsIGV2ZW50VHlwZSlcbiAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2lnbm9yZTogdHJ1ZX0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICApXG4gICAgKVxuICAgIHJldHVybiBkaXNwXG4gIH1cblxuICAvKlxuICBTaG93IHRvb2x0aXAgaW4gZWRpdG9yLlxuXG4gIGVkaXRvcjogZWRpdG9yIHRoYXQgd2lsbCBzaG93IHRvb2x0aXBcbiAgcG9zOiB0b29sdGlwIHBvc2l0aW9uXG4gIGV2ZW50VHlwZTogb25lIG9mICdjb250ZXh0JywgJ2tleWJvYXJkJyBhbmQgJ21vdXNlJ1xuICBkZXRhaWw6IGZvciBhdXRvbWF0aWMgc2VsZWN0aW9uIGJldHdlZW4gJ2NvbnRleHQnIGFuZCAna2V5Ym9hcmQnLlxuICAgICAgICAgIElnbm9yZWQgaWYgJ2V2ZW50VHlwZScgaXMgc2V0LlxuICB0b29sdGlwOiBmdW5jdGlvbihjcmFuZ2UpXG4gICAgY3JhbmdlOiBSYW5nZSwgY3VycmVudGx5IHNlbGVjdGVkIHJhbmdlIGluIGVkaXRvciAocG9zc2libHkgZW1wdHkpXG5cbiAgICBSZXR1cm5zIHtyYW5nZSwgdGV4dH0gb3IgUHJvbWlzZVxuICAgICAgcmFuZ2U6IFJhbmdlLCB0b29sdGlwIGhpZ2hsaWdodGluZyByYW5nZVxuICAgICAgcGVyc2lzdE9uQ3Vyc29yTW92ZTogQm9vbGVhbiwgb3B0aW9uYWwsIGRlZmF1bHQgZmFsc2UsIHBlcnNpc3Qgb24gY3Vyc29yIG1vdmUgcmVnYXJkbGVzcyBvZiBzZXR0aW5nc1xuICAgICAgdGV4dDogdG9vbHRpcCB0ZXh0LiBTdHJpbmcgb3Ige3RleHQsIGhpZ2hsaWdodGVyfSBvciB7aHRtbH1cbiAgICAgICAgdGV4dDogdG9vbHRpcCB0ZXh0XG4gICAgICAgIGhpZ2hsaWdodGVyOiBncmFtbWFyIHNjb3BlIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGhpZ2hsaWdodCB0b29sdGlwIHRleHRcbiAgICAgICAgaHRtbDogaHRtbCB0byBiZSBkaXNwbGF5ZWQgaW4gdG9vbHRpcFxuICAqL1xuICBzaG93VG9vbHRpcCAoe2VkaXRvciwgcG9zLCBldmVudFR5cGUsIGRldGFpbCwgdG9vbHRpcH0pIHtcbiAgICBsZXQgY29udHJvbGxlciA9IHRoaXMucGx1Z2luTWFuYWdlci5jb250cm9sbGVyKGVkaXRvcilcbiAgICByZXR1cm4gdGhpcy53aXRoRXZlbnRSYW5nZSh7Y29udHJvbGxlciwgcG9zLCBkZXRhaWwsIGV2ZW50VHlwZX0sICh7Y3JhbmdlLCBwb3MsIGV2ZW50VHlwZX0pID0+IHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodG9vbHRpcChjcmFuZ2UpKS50aGVuKCh7cmFuZ2UsIHRleHQsIHBlcnNpc3RPbkN1cnNvck1vdmV9KSA9PiBjb250cm9sbGVyLnNob3dUb29sdGlwKHBvcywgcmFuZ2UsIHRleHQsIHtldmVudFR5cGUsIHN1YnR5cGU6ICdleHRlcm5hbCcsIHBlcnNpc3RPbkN1cnNvck1vdmV9KSlcbiAgICAgIC5jYXRjaChzdGF0dXMgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzID09IG51bGwpIHsgc3RhdHVzID0ge3N0YXR1czogJ3dhcm5pbmcnfSB9XG4gICAgICAgIGlmIChzdGF0dXMgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihzdGF0dXMpXG4gICAgICAgICAgc3RhdHVzID0ge3N0YXR1czogJ3dhcm5pbmcnfVxuICAgICAgICB9XG4gICAgICAgIGlmICghc3RhdHVzLmlnbm9yZSkge1xuICAgICAgICAgIGNvbnRyb2xsZXIuaGlkZVRvb2x0aXAoe2V2ZW50VHlwZX0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdHVzKHN0YXR1cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICApXG4gIH1cblxuICAvKlxuICBDb252ZW5pZW5jZSBmdW5jdGlvbi4gV2lsbCBmaXJlIGJlZm9yZSBIYXNrZWxsIGJ1ZmZlciBpcyBzYXZlZC5cblxuICBjYWxsYmFjazogY2FsbGJhY2soYnVmZmVyKVxuICAgIGJ1ZmZlcjogVGV4dEJ1ZmZlciwgYnVmZmVyIHRoYXQgZ2VuZXJhdGVkIGV2ZW50XG5cbiAgUmV0dXJucyBEaXNwb3NhYmxlXG4gICovXG4gIG9uV2lsbFNhdmVCdWZmZXIgKGNhbGxiYWNrKSB7XG4gICAgbGV0IGRpc3BcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChkaXNwID0gdGhpcy5wbHVnaW5NYW5hZ2VyLm9uV2lsbFNhdmVCdWZmZXIoY2FsbGJhY2spKVxuICAgIHJldHVybiBkaXNwXG4gIH1cblxuICAvKlxuICBDb252ZW5pZW5jZSBmdW5jdGlvbi4gV2lsbCBmaXJlIGFmdGVyIEhhc2tlbGwgYnVmZmVyIGlzIHNhdmVkLlxuXG4gIGNhbGxiYWNrOiBjYWxsYmFjayhidWZmZXIpXG4gICAgYnVmZmVyOiBUZXh0QnVmZmVyLCBidWZmZXIgdGhhdCBnZW5lcmF0ZWQgZXZlbnRcblxuICBSZXR1cm5zIERpc3Bvc2FibGVcbiAgKi9cbiAgb25EaWRTYXZlQnVmZmVyIChjYWxsYmFjaykge1xuICAgIGxldCBkaXNwXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZGlzcCA9IHRoaXMucGx1Z2luTWFuYWdlci5vbkRpZFNhdmVCdWZmZXIoY2FsbGJhY2spKVxuICAgIHJldHVybiBkaXNwXG4gIH1cblxuICBvbkRpZFN0b3BDaGFuZ2luZyAoY2FsbGJhY2spIHtcbiAgICBsZXQgZGlzcFxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGRpc3AgPSB0aGlzLnBsdWdpbk1hbmFnZXIub25EaWRTdG9wQ2hhbmdpbmcoY2FsbGJhY2spKVxuICAgIHJldHVybiBkaXNwXG4gIH1cblxuICAvKlxuICBBZGQgYSBuZXcgY29udHJvbCB0byBvdXB0dXQgcGFuZWwgaGVhZGluZy5cblxuICBlbGVtZW50OiBIVE1MRWxlbWVudCBvZiBjb250cm9sLCBvciBTdHJpbmcgd2l0aCB0YWcgbmFtZVxuICBvcHRzOiB2YXJpb3VzIG9wdGlvbnNcbiAgICBpZDogU3RyaW5nLCBpZFxuICAgIGV2ZW50czogT2JqZWN0LCBldmVudCBjYWxsYmFja3MsIGtleSBpcyBldmVudCBuYW1lLCBlLmcuIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHZhbHVlIGlzIGNhbGxiYWNrXG4gICAgY2xhc3NlczogQXJyYXkgb2YgU3RyaW5nLCBjbGFzc2VzXG4gICAgc3R5bGU6IE9iamVjdCwgY3NzIHN0eWxlLCBrZXlzIGFyZSBzdHlsZSBhdHRyaWJ1dGVzLCB2YWx1ZXMgYXJlIHZhbHVlc1xuICAgIGF0dHJzOiBPYmplY3QsIG90aGVyIGF0dHJpYnV0ZXMsIGtleXMgYXJlIGF0dHJpYnV0ZSBuYW1lcywgdmFsdWVzIGFyZSB2YWx1ZXNcbiAgICBiZWZvcmU6IFN0cmluZywgQ1NTIHNlbGVjdG9yIG9mIGVsZW1lbnQsIHRoYXQgdGhpcyBvbmUgc2hvdWxkIGJlIGluc2VydGVkXG4gICAgICAgICAgICBiZWZvcmUsIGUuZy4gJyNwcm9ncmVzc0JhcidcblxuICBSZXR1cm5zIERpc3Bvc2FibGUuXG4gICovXG4gIGFkZFBhbmVsQ29udHJvbCAoZWxlbWVudCwgb3B0cykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hbmFnZXIub3V0cHV0Vmlldy5hZGRQYW5lbENvbnRyb2woZWxlbWVudCwgb3B0cylcbiAgfVxuXG4gIC8qXG4gIGFkZENvbmZpZ1BhcmFtXG4gICAgcGFyYW1fbmFtZTpcbiAgICAgIG9uQ2hhbmdlZDogY2FsbGJhY2sgdm9pZCh2YWx1ZSlcbiAgICAgIGl0ZW1zOiBBcnJheSBvciBjYWxsYmFjayBBcnJheSh2b2lkKVxuICAgICAgaXRlbVRlbXBsYXRlOiBjYWxsYmFjaywgU3RyaW5nKGl0ZW0pLCBodG1sIHRlbXBsYXRlXG4gICAgICBpdGVtRmlsdGVyS2V5OiBTdHJpbmcsIGl0ZW0gZmlsdGVyIGtleVxuICAgICAgZGVzY3JpcHRpb246IFN0cmluZyBbb3B0aW9uYWxdXG4gICAgICBkaXNwbGF5TmFtZTogU3RyaW5nIFtvcHRpb25hbCwgY2FwaXRhbGl6ZWQgcGFyYW1fbmFtZSBkZWZhdWx0XVxuICAgICAgZGlzcGxheVRlbXBsYXRlOiBjYWxsYmFjaywgU3RyaW5nKGl0ZW0pLCBzdHJpbmcgdGVtcGxhdGVcbiAgICAgIGRlZmF1bHQ6IGl0ZW0sIGRlZmF1bHQgdmFsdWVcblxuICBSZXR1cm5zXG4gICAgZGlzcDogRGlzcG9zYWJsZVxuICAgIGNoYW5nZTogb2JqZWN0IG9mIGNoYW5nZSBmdW5jdGlvbnMsIGtleXMgYmVpbmcgcGFyYW1fbmFtZVxuICAqL1xuICBhZGRDb25maWdQYXJhbSAoc3BlYykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hbmFnZXIuYWRkQ29uZmlnUGFyYW0odGhpcy5wbHVnaW5OYW1lLCBzcGVjKVxuICB9XG5cbiAgLypcbiAgZ2V0Q29uZmlnUGFyYW0ocGFyYW1OYW1lKSBvciBnZXRDb25maWdQYXJhbShwbHVnaW5OYW1lLCBwYXJhbU5hbWUpXG5cbiAgcmV0dXJucyBhIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byBwYXJhbWV0ZXJcbiAgdmFsdWUuXG5cbiAgUHJvbWlzZSBjYW4gYmUgcmVqZWN0ZWQgd2l0aCBlaXRoZXIgZXJyb3IsIG9yICd1bmRlZmluZWQnLiBMYXR0ZXJcbiAgaW4gY2FzZSB1c2VyIGNhbmNlbHMgcGFyYW0gc2VsZWN0aW9uIGRpYWxvZy5cbiAgKi9cbiAgZ2V0Q29uZmlnUGFyYW0gKHBsdWdpbk5hbWUsIG5hbWUpIHtcbiAgICBpZiAobmFtZSA9PSBudWxsKSB7XG4gICAgICBuYW1lID0gcGx1Z2luTmFtZTtcbiAgICAgICh7IHBsdWdpbk5hbWUgfSA9IHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBsdWdpbk1hbmFnZXIuZ2V0Q29uZmlnUGFyYW0ocGx1Z2luTmFtZSwgbmFtZSlcbiAgfVxuXG4gIC8qXG4gIHNldENvbmZpZ1BhcmFtKHBhcmFtTmFtZSwgdmFsdWUpIG9yIHNldENvbmZpZ1BhcmFtKHBsdWdpbk5hbWUsIHBhcmFtTmFtZSwgdmFsdWUpXG5cbiAgdmFsdWUgaXMgb3B0aW9uYWwuIElmIG9taXR0ZWQsIGEgc2VsZWN0aW9uIGRpYWxvZyB3aWxsIGJlIHByZXNlbnRlZCB0byB1c2VyLlxuXG4gIHJldHVybnMgYSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gcGFyYW1ldGVyIHZhbHVlLlxuXG4gIFByb21pc2UgY2FuIGJlIHJlamVjdGVkIHdpdGggZWl0aGVyIGVycm9yLCBvciAndW5kZWZpbmVkJy4gTGF0dGVyXG4gIGluIGNhc2UgdXNlciBjYW5jZWxzIHBhcmFtIHNlbGVjdGlvbiBkaWFsb2cuXG4gICovXG4gIHNldENvbmZpZ1BhcmFtIChwbHVnaW5OYW1lLCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IG5hbWVcbiAgICAgIG5hbWUgPSBwbHVnaW5OYW1lO1xuICAgICAgKHsgcGx1Z2luTmFtZSB9ID0gdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFuYWdlci5zZXRDb25maWdQYXJhbShwbHVnaW5OYW1lLCBuYW1lLCB2YWx1ZSlcbiAgfVxuXG4gIC8qXG4gIFV0aWxpdHkgZnVuY3Rpb24gdG8gZXh0cmFjdCBldmVudCByYW5nZS90eXBlIGZvciBhIGdpdmVuIGV2ZW50XG5cbiAgZWRpdG9yOiBUZXh0RWRpdG9yLCBlZGl0b3IgdGhhdCBnZW5lcmF0ZWQgZXZlbnRcbiAgZGV0YWlsOiBldmVudCBkZXRhaWwsIGlnbm9yZWQgaWYgZXZlbnRUeXBlIGlzIHNldFxuICBldmVudFR5cGU6IFN0cmluZywgZXZlbnQgdHlwZSwgb25lIG9mICdrZXlib2FyZCcsICdjb250ZXh0JywgJ21vdXNlJ1xuICBwb3M6IFBvaW50LCBvciBQb2ludC1saWtlIE9iamVjdCwgZXZlbnQgcG9zaXRpb24sIGNhbiBiZSB1bmRlZmluZWRcbiAgY29udHJvbGxlcjogbGVhdmUgdW5kZWZpbmVkLCB0aGlzIGlzIGludGVybmFsIGZpZWxkXG5cbiAgY2FsbGJhY2s6IGNhbGxiYWNrKHtwb3MsIGNyYW5nZX0sIGV2ZW50VHlwZSlcbiAgICBwb3M6IFBvaW50LCBldmVudCBwb3NpdGlvblxuICAgIGNyYW5nZTogUmFuZ2UsIGV2ZW50IHJhbmdlXG4gICAgZXZlbnRUeXBlOiBTdHJpbmcsIGV2ZW50IHR5cGUsIG9uZSBvZiAna2V5Ym9hcmQnLCAnY29udGV4dCcsICdtb3VzZSdcbiAgKi9cbiAgd2l0aEV2ZW50UmFuZ2UgKHtlZGl0b3IsIGRldGFpbCwgZXZlbnRUeXBlLCBwb3MsIGNvbnRyb2xsZXJ9LCBjYWxsYmFjaykge1xuICAgIGlmIChwb3MgIT0gbnVsbCkgeyBwb3MgPSBQb2ludC5mcm9tT2JqZWN0KHBvcykgfVxuICAgIGlmIChldmVudFR5cGUgPT0gbnVsbCkgeyBldmVudFR5cGUgPSBnZXRFdmVudFR5cGUoZGV0YWlsKSB9XG4gICAgaWYgKGNvbnRyb2xsZXIgPT0gbnVsbCkgeyBjb250cm9sbGVyID0gdGhpcy5wbHVnaW5NYW5hZ2VyLmNvbnRyb2xsZXIoZWRpdG9yKSB9XG4gICAgaWYgKGNvbnRyb2xsZXIgPT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgcmV0dXJuIGNhbGxiYWNrKChjb250cm9sbGVyLmdldEV2ZW50UmFuZ2UocG9zLCBldmVudFR5cGUpKSlcbiAgfVxufVxuIl19