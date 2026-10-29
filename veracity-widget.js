/* ==========================================================
   VERACITY AUTOTRONIX - BATTERY FINDER & BOOKING WEB COMPONENT
   File: veracity-widget.js
   ========================================================== */

class VeracityWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Internal State
    this.activeTab = 'finder'; // 'finder' or 'booking'
    this.supabaseClient = null;
  }

  connectedCallback() {
    this.render();
    this.initSupabase();
    this.attachEventListeners();
  }

  initSupabase() {
    // FIXED: Removed the trailing '/rest/v1' path so the SDK builds proper API endpoints
    const SUPABASE_URL = 'https://kfffkzvpyiaxiaviogki.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZmZrenZweWlheGlhdmlvZ2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTY2ODUsImV4cCI6MjEwODc3MjY4NX0.hqunmCkpa9isA93S_4x9la4q4hIYyhOz39JfvJip3KU';

    if (window.supabase) {
      this.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
      console.warn('Supabase SDK not loaded on host page.');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #ffffff;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

       .widget-container {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);

  /* Fix scrolling issues */
  max-height: 85vh;          /* Prevents the widget from expanding past 85% of screen height */
  overflow-y: auto;          /* Enables internal vertical scrolling */
  scrollbar-width: thin;     /* Keeps the scrollbar neat */
  scrollbar-color: #00d26a rgba(30, 41, 59, 0.8);
}
          
        }

        .tabs-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px 14px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn.active,
        .tab-btn:hover {
          background: #00d26a;
          color: #000000;
          border-color: #00d26a;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .form-control,
        .form-select {
          width: 100%;
          padding: 12px 14px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #00d26a;
        }

        .form-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background: #00d26a;
          color: #000000;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-top: 6px;
        }

        .btn-submit:hover {
          background: #00b359;
        }

        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        .status-msg {
          margin-top: 12px;
          font-size: 13px;
          text-align: center;
        }

        .battery-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          margin-top: 10px;
        }

        .battery-card h4 {
          color: #00d26a;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .battery-card p {
          font-size: 13px;
          color: #94a3b8;
        }

        @media (max-width: 480px) {
          .widget-container {
            padding: 14px;
          }
          .tab-btn {
            font-size: 12px;
            padding: 8px;
          }
        }
      </style>

      <div class="widget-container">
        <!-- Navigation Tabs -->
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab="finder">Battery Finder</button>
          <button class="tab-btn" data-tab="booking">Book Service</button>
        </div>

        <!-- Tab 1: Battery Finder -->
        <div class="tab-content active" id="tab-finder">
          <div class="form-group">
            <label>Filter By Application</label>
            <select class="form-select" id="appFilter">
              <option value="automotive">Automotive</option>
              <option value="solar">Solar / Deep Cycle</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <div class="form-group">
            <label>Search Model / Brand</label>
            <input type="text" class="form-control" id="batterySearch" placeholder="e.g. Willard, 619, YTX9..." />
          </div>
          <button class="btn-submit" id="searchBtn">Search Batteries</button>
          <div id="searchResults" style="margin-top: 16px;"></div>
        </div>

        <!-- Tab 2: Service Booking -->
        <div class="tab-content" id="tab-booking">
          <form id="bookingForm">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" name="name" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" class="form-control" name="phone" placeholder="+265..." required />
            </div>
            <div class="form-group">
              <label>Vehicle Model</label>
              <input type="text" class="form-control" name="vehicle" placeholder="e.g. Toyota Hilux" required />
            </div>
            <div class="form-group">
              <label>Service Required</label>
              <select class="form-select" name="service">
                <option value="Battery Testing & Fitment">Battery Testing & Fitment</option>
                <option value="Auto Electrical Diagnostics">Auto Electrical Diagnostics</option>
                <option value="Solar Installation Advice">Solar Installation Advice</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">Submit Booking</button>
          </form>
          <div class="status-msg" id="bookingStatus"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const shadow = this.shadowRoot;

    // Tab Switching Logic
    shadow.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        shadow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        shadow.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        const targetTab = e.target.getAttribute('data-tab');
        e.target.classList.add('active');
        shadow.getElementById(`tab-${targetTab}`).classList.add('active');
      });
    });

     // Clear results automatically when user changes input text
    const searchInput = shadow.getElementById('batterySearch');
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '') {
        shadow.getElementById('searchResults').innerHTML = '';
      }
    });

    // Battery Finder Search Logic
    const searchBtn = shadow.getElementById('searchBtn');
    searchBtn.addEventListener('click', async () => {
      const resultsDiv = shadow.getElementById('searchResults');
      const query = shadow.getElementById('batterySearch').value.trim();
      const appFilter = shadow.getElementById('appFilter').value;

      resultsDiv.innerHTML = '<p style="color: #94a3b8; font-size: 13px; text-align: center;">Searching batteries...</p>';

      if (!this.supabaseClient) {
        resultsDiv.innerHTML = '<p style="color: #ef4444; font-size: 13px;">Database connection not initialized.</p>';
        return;
      }

      // Query the 'batteries' table
      let dbQuery = this.supabaseClient.from('batteries').select('*');

      if (query) {
        dbQuery = dbQuery.or(`brand.ilike.%${query}%,model.ilike.%${query}%`);
      }

      const { data, error } = await dbQuery;

      if (error) {
        resultsDiv.innerHTML = `<p style="color: #ef4444; font-size: 13px;">Error: ${error.message}</p>`;
      } else if (!data || data.length === 0) {
        resultsDiv.innerHTML = '<p style="color: #94a3b8; font-size: 13px; text-align: center;">No matching batteries found.</p>';
      } else {
        resultsDiv.innerHTML = data.map(bat => `
          <div class="battery-card">
            <h4>${bat.brand || 'Battery'} - ${bat.model || ''}</h4>
            <p><strong>Capacity:</strong> ${bat.capacity || 'N/A'} | <strong>Voltage:</strong> ${bat.voltage || '12V'}</p>
            <p>${bat.description || bat.notes || ''}</p>
          </div>
        `).join('');
      }
    });

   // Booking Form Submission to Supabase & WhatsApp
    const form = shadow.getElementById('bookingForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Collect form inputs
        const name = shadow.getElementById('clientName')?.value || 'N/A';
        const phone = shadow.getElementById('clientPhone')?.value || 'N/A';
        const service = shadow.getElementById('serviceType')?.value || 'General Booking';
        const notes = shadow.getElementById('bookingNotes')?.value || 'None';

        // 2. (Optional) Save to your Supabase database first
        /* 
        const { data, error } = await supabase.from('bookings').insert([
          { name, phone, service, notes }
        ]);
        */

        // 3. Format the WhatsApp message
        const whatsappNumber = '265999732689'; // Replace with your full WhatsApp number (e.g. 265991234567)
        
        const message = `Hello Veracity Autotronix! 👋\n\nI would like to book a service.\n\n` +
                        `*Name:* ${name}\n` +
                        `*Phone:* ${phone}\n` +
                        `*Service Requested:* ${service}\n` +
                        `*Details/Notes:* ${notes}`;

        // 4. Encode text and open WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Opens WhatsApp on mobile or WhatsApp Web on desktop
        window.open(whatsappUrl, '_blank');

        // Reset form
        form.reset();
      });
    }
}

// Define the custom HTML element
customElements.define('veracity-battery-widget', VeracityWidget);
