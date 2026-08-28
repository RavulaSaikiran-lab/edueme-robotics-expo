
const FEEDBACK_ENDPOINT = "https://script.google.com/macros/s/AKfycbwPuv9nTLyGIq_QN8e-fdqV43VdYGTyRHpbCxtclco2Xz8sRaIESBI8khStAQaLJ3MyDg/exec";

function feedbackEscape(value) {
  return String(value ?? "").replace(/[&<>'"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"
  }[c]));
}

function feedbackFormMarkup(currentProject = "") {
  const options = projects.map(p =>
    `<option value="${feedbackEscape(p.title)}" ${p.title === currentProject ? "selected" : ""}>${feedbackEscape(p.title)}</option>`
  ).join("");

  return `
  <form class="feedback-form" id="expoFeedbackForm" novalidate>
    <input type="hidden" name="pageProject" value="${feedbackEscape(currentProject)}">
    <div class="feedback-form-head">
      <div>
        <span class="form-code">FEEDBACK_CHANNEL // 01</span>
        <h3>Tell us what stood out.</h3>
        <p>Two minutes can help our young innovators build what comes next.</p>
      </div>
      <div class="signal-dot"><span></span> READY</div>
    </div>

    <div class="feedback-fields">
      <label class="feedback-field">
        <span>01 / YOUR NAME <em>OPTIONAL</em></span>
        <input type="text" name="name" maxlength="80" placeholder="Enter your name">
      </label>

      <label class="feedback-field">
        <span>02 / PROJECT YOU EXPLORED</span>
        <select name="project" required>
          <option value="">Select a project</option>
          ${options}
        </select>
      </label>

      <fieldset class="rating-field">
        <legend>03 / PROJECT RATING</legend>
        <div class="star-rating" data-rating="projectRating">
          ${[1,2,3,4,5].map(n => `<button type="button" class="rating-star" data-value="${n}" aria-label="${n} out of 5">★</button>`).join("")}
        </div>
        <input type="hidden" name="projectRating" required>
        <small class="rating-label">SELECT A RATING</small>
      </fieldset>

      <fieldset class="rating-field">
        <legend>04 / OVERALL EXPO RATING</legend>
        <div class="star-rating" data-rating="expoRating">
          ${[1,2,3,4,5].map(n => `<button type="button" class="rating-star" data-value="${n}" aria-label="${n} out of 5">★</button>`).join("")}
        </div>
        <input type="hidden" name="expoRating" required>
        <small class="rating-label">SELECT A RATING</small>
      </fieldset>

      <label class="feedback-field full">
        <span>05 / WHAT DID YOU LIKE MOST?</span>
        <textarea name="liked" maxlength="1000" rows="4" placeholder="Tell us what impressed or inspired you..."></textarea>
      </label>

      <label class="feedback-field">
        <span>06 / MOST IMPRESSIVE PROJECT</span>
        <select name="impressive" required>
          <option value="">Choose one</option>
          ${options}
        </select>
      </label>

      <label class="feedback-field">
        <span>07 / SUGGESTIONS & FEEDBACK</span>
        <textarea name="suggestions" maxlength="1000" rows="4" placeholder="Your suggestions for future innovation showcases..."></textarea>
      </label>
    </div>

    <div class="feedback-submit-row">
      <p><span class="tiny-led"></span> Your response goes securely to the exhibition feedback sheet.</p>
      <button class="primary-btn feedback-submit" type="submit">
        <span>SUBMIT FEEDBACK</span><b>→</b>
      </button>
    </div>
    <div class="feedback-status" role="status" aria-live="polite"></div>
  </form>`;
}

function initFeedbackForm(currentProject = "") {
  const mount = document.getElementById("feedbackMount");
  if (!mount) return;

  mount.innerHTML = feedbackFormMarkup(currentProject);
  const form = document.getElementById("expoFeedbackForm");

  form.querySelectorAll(".star-rating").forEach(group => {
    const hidden = form.querySelector(`input[name="${group.dataset.rating}"]`);
    const label = group.parentElement.querySelector(".rating-label");
    group.querySelectorAll(".rating-star").forEach(star => {
      star.addEventListener("click", () => {
        const value = Number(star.dataset.value);
        hidden.value = value;
        group.querySelectorAll(".rating-star").forEach(s => {
          s.classList.toggle("selected", Number(s.dataset.value) <= value);
        });
        label.textContent = `${value} / 5 — ${["","NEEDS IMPROVEMENT","FAIR","GOOD","VERY GOOD","EXCELLENT"][value]}`;
      });
    });
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const status = form.querySelector(".feedback-status");
    const button = form.querySelector(".feedback-submit");
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.project || !data.projectRating || !data.expoRating || !data.impressive) {
      status.className = "feedback-status error";
      status.textContent = "Please select the project and both ratings before submitting.";
      form.querySelectorAll("[required]").forEach(el => {
        if (!el.value) el.classList.add("field-error");
      });
      return;
    }

    form.querySelectorAll(".field-error").forEach(el => el.classList.remove("field-error"));
    button.disabled = true;
    button.classList.add("sending");
    button.querySelector("span").textContent = "SENDING...";

    try {
      // Apps Script accepts the JSON body. text/plain keeps this request simple
      // so a static GitHub Pages site does not need a separate server.
      await fetch(FEEDBACK_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name: data.name || "",
          project: data.project,
          projectRating: data.projectRating,
          expoRating: data.expoRating,
          liked: data.liked || "",
          impressive: data.impressive,
          suggestions: data.suggestions || "",
          pageProject: data.pageProject || ""
        })
      });

      form.innerHTML = `
        <div class="feedback-success">
          <div class="success-core"><span>✓</span></div>
          <span class="form-code">FEEDBACK_CHANNEL // COMPLETE</span>
          <h3>Signal received.</h3>
          <p>Thank you for supporting our young innovators. Your feedback has been sent to the exhibition feedback sheet.</p>
          <div class="success-line"><span></span> THANK YOU FOR BEING PART OF THE EXPO <span></span></div>
        </div>`;
    } catch (error) {
      button.disabled = false;
      button.classList.remove("sending");
      button.querySelector("span").textContent = "SUBMIT FEEDBACK";
      status.className = "feedback-status error";
      status.textContent = "We couldn't send the response. Please try again.";
    }
  });
}
