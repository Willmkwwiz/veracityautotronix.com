class VeracityWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .widget-container {
          background: #0f172a;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          max-height: 80vh;
          overflow-y: auto;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          border-radius: 8px;
        }

        .tab-btn.active {
          background: #2563eb;
          color: #ffffff;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          margin-top: 6px;
          margin-bottom: 14px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #ffffff;
          box-sizing: border-box;
        }

        button.submit-btn {
          width: 100%;
          background: #25d366; /* WhatsApp Green */
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        button.submit-btn:hover {
          background: #1da851;
        }
      </style>

      <div class="widget-container">
        <div class="tabs">
          <button class="tab-btn active" data-tab="finder">Battery Finder</button>
          <button class="tab-btn" data-tab="booking">Book Service</button>
        </div>

        <!-- Tab 1: Battery Finder -->
        <div class="tab-content active" id="tab-finder">
          <label for="batterySearch">Search Battery Model</label>
          <input type="text" id="batterySearch" placeholder="e.g. N70, 658, AGM..." />
          <div id="searchResults"></div>
        </div>

        <!-- Tab 2: Booking -->
        <div class="tab-content" id="tab-booking">
          <form id="bookingForm">
            <label>Your Name</label>
            <input type="text" id="clientName" placeholder="Enter your full name" required />

            <label>Phone Number</label>
            <input type="tel" id="clientPhone" placeholder="099X XXX XXX" required />

            <label>Service Needed</label>
            <select id="serviceType">
              <option value="Battery Replacement">Battery Replacement</option>
              <option value="Diagnostics">Electrical Diagnostics</option>
              <option value="Solar / Inverter Setup">Solar / Inverter Setup</option>
            </select>

            <label>Notes / Vehicle Details</label>
            <textarea id="bookingNotes" rows="3" placeholder="Car model, location, etc."></textarea>

            <button type="submit" class="submit-btn">Send Booking via WhatsApp</button>
          </form>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const shadow = this.shadowRoot;

    // 1. Tab switching
    const tabs = shadow.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        shadow.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab');
        shadow.getElementById(`tab-${targetTab}`).classList.add('active');
      });
    });

    // 2. Clear search when empty
    const searchInput = shadow.getElementById('batterySearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
          shadow.getElementById('searchResults').innerHTML = '';
        }
      });
    }

    // 3. WhatsApp Form Submit
    const form = shadow.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = shadow.getElementById('clientName')?.value || 'N/A';
        const phone = shadow.getElementById('clientPhone')?.value || 'N/A';
        const service = shadow.getElementById('serviceType')?.value || 'General Booking';
        const notes = shadow.getElementById('bookingNotes')?.value || 'None';

        // Add your full WhatsApp number (Country code 265 for Malawi)
        const whatsappNumber = '265999732689'; 

        const message = `Hello Veracity Autotronix! 👋\n\nI would like to book a service:\n\n` +
                        `*Name:* ${name}\n` +
                        `*Phone:* ${phone}\n` +
                        `*Service:* ${service}\n` +
                        `*Notes:* ${notes}`;

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        form.reset();
      });
    }
  }
}

customElements.define('veracity-battery-widget', VeracityWidget);
