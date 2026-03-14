const pages = [
  {
    id: "q1",
    title: "Q1. On average, how often do you feel fatigued in the 3–5 days before or during your period?",
    type: "radio",
    name: "fatigueFrequency",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely (1–2 cycles per year)" },
      { value: "sometimes", label: "Sometimes (a few cycles per year)" },
      { value: "most", label: "Most of the time (most cycles)" },
      { value: "always", label: "Always (every cycle)" },
    ],
  },
  {
    id: "q2",
    title: "Q2. How severe are your menstrual cramps on your heaviest flow day, on average?",
    type: "radio",
    name: "crampsSeverity",
    subtitle: "(1 = No pain at all; 10 = Worst pain imaginable)",
    options: Array.from({ length: 10 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    })),
  },
  {
    id: "q3",
    title: "Q3. Which of the following nutrients have you heard play a role in menstrual health? (Select all that apply)",
    type: "checkbox",
    name: "nutrients",
    options: [
      { value: "iron", label: "Iron" },
      { value: "magnesium", label: "Magnesium" },
      { value: "vitamin_d", label: "Vitamin D" },
      { value: "omega_3", label: "Omega-3 fatty acids" },
      { value: "calcium", label: "Calcium" },
      { value: "vitamin_b12", label: "Vitamin B12" },
      { value: "none", label: "None of the above" },
      { value: "not_sure", label: "I'm not sure" },
    ],
  },
  {
    id: "q4",
    title: "Q4. In the past three months, did you make any intentional changes to your diet around the time of your period?",
    type: "radio",
    name: "dietChange",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "dont_track", label: "I don't track my cycle closely enough to know" },
    ],
    followup: {
      name: "dietChangeDetails",
      placeholder: "If yes, briefly describe what changes you made...",
    },
  },
  {
    id: "q5",
    title: "Q5. Using the scale below, please rate your level of agreement with each statement:",
    type: "likert",
    likertItems: [
      {
        key: "informed",
        label: "I feel informed about how my diet affects my menstrual symptoms.",
      },
      {
        key: "eat_nutrient_rich",
        label: "I actively try to eat nutrient-rich foods in the week before my period.",
      },
      {
        key: "know_fatigue_foods",
        label: "I know which foods can help reduce menstrual fatigue.",
      },
      {
        key: "provider_discussed",
        label: "Healthcare providers have discussed nutrition and menstrual health with me.",
      },
    ],
    scale: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neither Agree nor Disagree" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" },
    ],
  },
];

const state = {
  currentPage: 0,
  answers: {},
};

const intro = document.getElementById("intro");
const beginBtn = document.getElementById("beginBtn");
const surveyContainer = document.getElementById("surveyContainer");
const nav = document.querySelector(".survey__nav");
const footer = document.querySelector(".survey__footer");

function buildPage(page) {
  const section = document.createElement("section");
  section.className = "survey__page";
  section.id = page.id;

  const questionHeading = document.createElement("p");
  questionHeading.className = "question";
  questionHeading.textContent = page.title;
  section.appendChild(questionHeading);

  if (page.subtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "question question--subtitle";
    subtitle.textContent = page.subtitle;
    section.appendChild(subtitle);
  }

  if (page.type === "radio" || page.type === "checkbox") {
    const options = document.createElement("div");
    options.className = "options";

    page.options.forEach(option => {
      const optionWrapper = document.createElement("label");
      optionWrapper.className = "option";

      const input = document.createElement("input");
      input.type = page.type;
      input.name = page.name;
      input.value = option.value;
      input.id = `${page.id}-${option.value}`;

      if (page.type === "radio") {
        input.addEventListener("change", () => {
          state.answers[page.name] = option.value;
          renderNavState();
        });
      } else if (page.type === "checkbox") {
        input.addEventListener("change", () => {
          state.answers[page.name] = Array.from(
            document.querySelectorAll(`input[name="${page.name}"]:checked`)
          ).map(el => el.value);
          renderNavState();
        });
      }

      optionWrapper.appendChild(input);

      const label = document.createElement("span");
      label.textContent = option.label;
      optionWrapper.appendChild(label);

      options.appendChild(optionWrapper);
    });

    section.appendChild(options);

    if (page.followup) {
      const followupWrapper = document.createElement("div");
      followupWrapper.style.marginTop = "16px";

      const followupTextarea = document.createElement("textarea");
      followupTextarea.name = page.followup.name;
      followupTextarea.placeholder = page.followup.placeholder;
      followupTextarea.addEventListener("input", event => {
        state.answers[page.followup.name] = event.target.value;
      });

      followupWrapper.appendChild(followupTextarea);
      section.appendChild(followupWrapper);
    }
  }

  if (page.type === "likert") {
    const table = document.createElement("table");
    table.className = "likert";
    table.style.width = "100%;";
    table.style.borderCollapse = "collapse";

    const headerRow = document.createElement("tr");
    const firstHeaderCell = document.createElement("th");
    firstHeaderCell.textContent = "";
    firstHeaderCell.style.textAlign = "left";
    firstHeaderCell.style.padding = "8px 8px 8px 0";
    headerRow.appendChild(firstHeaderCell);

    page.scale.forEach(scaleOption => {
      const th = document.createElement("th");
      th.textContent = scaleOption.value;
      th.style.padding = "8px";
      th.style.fontWeight = "600";
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    page.likertItems.forEach(item => {
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.textContent = item.label;
      labelCell.style.padding = "12px 8px 12px 0";
      labelCell.style.verticalAlign = "top";
      row.appendChild(labelCell);

      page.scale.forEach(scaleOption => {
        const cell = document.createElement("td");
        cell.style.padding = "12px 8px";
        cell.style.textAlign = "center";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = item.key;
        input.value = scaleOption.value;
        input.addEventListener("change", () => {
          state.answers[item.key] = scaleOption.value;
          renderNavState();
        });

        cell.appendChild(input);
        row.appendChild(cell);
      });

      table.appendChild(row);
    });

    section.appendChild(table);
  }

  return section;
}

function renderSurvey() {
  surveyContainer.innerHTML = "";
  pages.forEach(page => {
    surveyContainer.appendChild(buildPage(page));
  });

  showCurrentPage();
}

function showCurrentPage() {
  const pageEls = document.querySelectorAll(".survey__page");
  pageEls.forEach((el, idx) => {
    el.classList.toggle("is-visible", idx === state.currentPage);
  });

  prevBtn.disabled = state.currentPage === 0;
  nextBtn.textContent = state.currentPage === pages.length - 1 ? "Submit" : "Next →";
  progressText.textContent = `Page ${state.currentPage + 1} of ${pages.length}`;
  renderNavState();
}

function renderNavState() {
  // Enable next button only when required questions are answered.
  const currentPage = pages[state.currentPage];

  if (!currentPage) {
    nextBtn.disabled = true;
    return;
  }

  if (currentPage.type === "radio") {
    nextBtn.disabled = !state.answers[currentPage.name];
    return;
  }

  if (currentPage.type === "checkbox") {
    const value = state.answers[currentPage.name];
    nextBtn.disabled = !value || value.length === 0;
    return;
  }

  if (currentPage.type === "likert") {
    const missing = currentPage.likertItems.some(item => !state.answers[item.key]);
    nextBtn.disabled = missing;
    return;
  }

  nextBtn.disabled = false;
}

function showSummary() {
  surveyContainer.innerHTML = "";

  const summary = document.createElement("section");
  summary.className = "summary";

  const heading = document.createElement("h2");
  heading.textContent = "Thank you! Here's what you shared:";
  summary.appendChild(heading);

  const buildLine = (label, value) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${label}</strong> ${value || "(no response)"}`;
    return p;
  };

  summary.appendChild(buildLine("Fatigue frequency:", formatAnswer(state.answers.fatigueFrequency)));
  summary.appendChild(buildLine("Cramps severity:", formatAnswer(state.answers.crampsSeverity)));
  summary.appendChild(buildLine("Nutrients known:", formatAnswer(state.answers.nutrients)));
  summary.appendChild(buildLine("Diet changes (past 3 months):", formatAnswer(state.answers.dietChange)));
  summary.appendChild(buildLine("Diet change details:", formatAnswer(state.answers.dietChangeDetails)));

  const likert = pages.find(p => p.type === "likert");
  likert.likertItems.forEach(item => {
    summary.appendChild(buildLine(item.label, formatAnswer(state.answers[item.key])));
  });

  surveyContainer.appendChild(summary);
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  progressText.textContent = "Complete";
}

function formatAnswer(value) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "(none)";
  }
  return value || "(none)";
}

prevBtn.addEventListener("click", () => {
  if (state.currentPage > 0) {
    state.currentPage -= 1;
    showCurrentPage();
  }
});

nextBtn.addEventListener("click", () => {
  if (state.currentPage < pages.length - 1) {
    state.currentPage += 1;
    showCurrentPage();
    return;
  }

  showSummary();
});

renderSurvey();

beginBtn.addEventListener("click", () => {
  intro.style.display = "none";
  surveyContainer.style.display = "block";
  nav.style.display = "flex";
  footer.style.display = "block";
  showCurrentPage();
});
