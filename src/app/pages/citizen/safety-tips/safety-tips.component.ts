import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@app/shared/back-button/back-button.component';

@Component({
  selector: 'app-safety-tips',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
<app-back-button></app-back-button>

<div class="safety-page">

  <div class="header">
    <h1>🛡 Safety Intelligence</h1>
    <p>
      Stay alert. Stay informed. Stay safe.
      CrimeShark helps you understand nearby risks and take smarter actions in real time.
    </p>
  </div>

  <section>
    <h2>🔎 By Crime Type</h2>

    <div class="tip-section">
      <h3>🚨 Robbery</h3>
      <ul>
        <li>Avoid using mobile phones in high-risk or crowded areas.</li>
        <li>Stay alert near ATMs, banks, and marketplaces.</li>
        <li>Walk confidently and stay aware of surroundings.</li>
        <li>If confronted, do not resist — safety comes first.</li>
        <li>Report suspicious behavior immediately.</li>
      </ul>
    </div>

    <div class="tip-section">
      <h3>🏠 Burglary</h3>
      <ul>
        <li>Lock doors and windows, even briefly.</li>
        <li>Use lighting and motion sensors where possible.</li>
        <li>Avoid sharing travel plans publicly.</li>
        <li>Inform trusted neighbors when away.</li>
      </ul>
    </div>

    <div class="tip-section">
      <h3>💻 Cybercrime</h3>
      <ul>
        <li>Never share OTPs or passwords.</li>
        <li>Avoid unknown links or reward offers.</li>
        <li>Use strong, unique passwords.</li>
        <li>Verify online transactions carefully.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>📍 Situation Awareness</h2>

    <div class="tip-section">
      <h3>🌙 Night Travel</h3>
      <ul>
        <li>Prefer populated and well-lit routes.</li>
        <li>Use verified transport services.</li>
        <li>Inform someone before heading out.</li>
      </ul>
    </div>

    <div class="tip-section">
      <h3>🚶 Walking Alone</h3>
      <ul>
        <li>Share live location when possible.</li>
        <li>Avoid isolated shortcuts.</li>
        <li>Stay aware of movement around you.</li>
      </ul>
    </div>
  </section>

  <section>
    <h2>🚑 Emergency Response</h2>
    <ul class="simple-list">
      <li>Move to a safe and crowded location.</li>
      <li>Contact emergency services immediately.</li>
      <li>Report through CrimeShark with accurate details.</li>
    </ul>
  </section>


</div>
`,
  styles: [`

.safety-page {
  padding: 60px 8%;
  min-height: 100vh;
  background: linear-gradient(135deg, #eef4fb 0%, #dde9f5 100%);
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: #1e293b;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.header h1 {
  font-size: 36px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 15px;
  margin-top: -10px
}

.header p {
  font-size: 17px;
  max-width: 750px;
  margin: 0 auto;
  color: #475569;
  line-height: 1.7;
}

section {
  margin-bottom: 55px;
}

h2 {
  font-size: 24px;
  margin-bottom: 25px;
  color: #0f172a;
  display: inline-block;
  padding-bottom: 6px;
  border-bottom: 2px solid #38bdf8;
}

.tip-section {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  padding: 20px 25px;
  border-radius: 14px;
  margin-bottom: 20px;
  border: 1px solid rgba(15, 23, 42, 0.05);
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tip-section:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #0f172a;
}

ul {
  margin-left: 20px;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #334155;
}


`]
})
export class SafetyTipsComponent { }
