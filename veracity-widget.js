class VeracityBatteryWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Your HTML structure and CSS live safely encapsulated here
        this.shadowRoot.innerHTML = `
            <style>
                /* All your widget.css styles go right here */
                :host { display: block; width: 100%; max-width: 600px; margin: 0 auto; font-family: sans-serif; }
                .widget-container { background: rgba(15, 23, 42, 0.9); border-radius: 16px; padding: 20px; color: white; }
                .tab-btn { background: transparent; border: 1px solid #475569; color: #94a3b8; padding: 10px; cursor: pointer; }
                .tab-btn.active { background: #00d26a; color: black; border-color: #00d26a; }
            </style>
            <div class="widget-container">
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button class="tab-btn active">Battery Finder</button>
                    <button class="tab-btn">Book Service</button>
                </div>
                <!-- Dynamic Content Renders Here -->
            </div>
        `;
    }
}

// Register the custom HTML tag
customElements.define('veracity-battery-widget', VeracityBatteryWidget);
