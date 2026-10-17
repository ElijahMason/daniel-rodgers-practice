var CONTACT_EMAIL="";

(function () {
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
      if (!open) nav.focus();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });
  }

  var path = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
  document.querySelectorAll("[data-nav] a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/\.html$/, "");
    if (href === path) link.setAttribute("aria-current", "page");
  });

  var form = document.querySelector("[data-brief]");
  if (!form) return;

  var panel = form.querySelector("[data-brief-panel]");
  var output = form.querySelector("[data-brief-out]");
  var status = form.querySelector("[data-brief-status]");
  var copyButton = form.querySelector("[data-brief-copy]");
  var mail = form.querySelector("[data-brief-mail]");

  function fieldValue(name) {
    var field = form.elements[name];
    if (!field) return "(left blank)";
    var raw = "value" in field ? String(field.value || "") : "";
    raw = raw.trim();
    return raw || "(left blank)";
  }

  function briefText() {
    return [
      "Brief for Daniel Rodgers",
      "",
      "What I am making: " + fieldValue("making"),
      "The question this build should answer: " + fieldValue("question"),
      "Kind of work: " + fieldValue("kind"),
      "Materials in mind: " + fieldValue("materials"),
      "What the factory needs to see: " + fieldValue("factory"),
      "Reply to: " + fieldValue("reply")
    ].join("\n");
  }

  function showBrief() {
    var text = briefText();
    output.textContent = text;
    panel.hidden = false;
    if (CONTACT_EMAIL) {
      mail.hidden = false;
      mail.href = "mailto:" + CONTACT_EMAIL
        + "?subject=" + encodeURIComponent("Brief for Daniel Rodgers")
        + "&body=" + encodeURIComponent(text);
    } else {
      mail.hidden = true;
      mail.removeAttribute("href");
    }
    return text;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showBrief();
    status.textContent = CONTACT_EMAIL
      ? "The brief is on the page. Copy it, or open a message."
      : "The brief is on the page. Copy it and send it by the channel you already use.";
  });

  copyButton.addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var text = showBrief();
    function copied() {
      status.textContent = "Copied. Paste it into a message you already trust.";
    }
    function failed() {
      status.textContent = "Select the brief and copy it from the page.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(copied, failed);
    } else {
      failed();
    }
  });
})();
