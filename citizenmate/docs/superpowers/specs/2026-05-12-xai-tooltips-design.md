# Phase 12: Explainable AI (XAI) Tooltips — Design Spec

**Date:** 2026-05-12
**Status:** Approved (via previous context document decisions)
**Milestone:** v1.2 Adaptive Gamification & Trust-building

---

## 1. Component: `XaiTooltip`

A lightweight, non-blocking tooltip popover that explains SRS interval logic to the user.

### Props

```ts
interface XaiTooltipProps {
  /** i18n key to look up explanation text (e.g. "xai.interval.explanation") */
  i18nKey: string;
  /** Optional custom explanation text (overrides i18nKey if provided) */
  explanation?: string;
  /** Position of the tooltip relative to the trigger */
  side?: "top" | "bottom" | "left" | "right";
  /** Size variant */
  size?: "sm" | "md";
}
```

### Behavior

- **Trigger:** Click on the info icon (ℹ) toggles the tooltip open/close
- **Close:** Click the icon again, click outside, or press Escape
- **Animation:** Framer Motion fade-in + subtle slide-up (y: 4→0)
- **Non-blocking:** Does not prevent interaction with the underlying UI

### Visual Style

- Dark glass popover: `bg-white/5 backdrop-blur-xl` with `border border-white/10`
- Text: `text-white/90` with `text-xs` font weight
- Icon: Lucide `Info` icon, 14px, with `text-purple-400` hover → `text-purple-300`
- Corner radius: `rounded-xl`
- Shadow: `shadow-2xl`
- Max width: `max-w-xs` (280px) for mobile safety

### States

| State | Visual |
|-------|--------|
| Idle (closed) | Info icon visible, no tooltip |
| Open | Tooltip popover appears above/below the icon |
| Hover (icon) | Icon color brightens to purple-300 |
| Mobile | Tooltip positions above icon, respects viewport edges |

---

## 2. i18n Keys

Add a new `xai` section to each locale dictionary:

### English (`en.json`)

```json
{
  "xai": {
    "interval_explanation": "The next review time is calculated based on your performance history. Correct answers increase the gap between reviews, while incorrect answers bring the question back sooner. This spacing helps move knowledge into long-term memory.",
    "confidence_explanation": "Your confidence level is determined by how consistently you answer correctly. Higher confidence means longer intervals between reviews. Each correct answer in a row strengthens your confidence score.",
    "early_review": "Reviewing a question before its scheduled time may not improve retention as effectively as waiting for the optimal review window. The SRS algorithm schedules each review at the ideal moment for memory consolidation.",
    "late_review": "If you miss a scheduled review, the question becomes overdue and will be prioritised in your next session. While occasional late reviews are fine, consistent on-time reviewing builds the strongest long-term memory.",
    "how_srs_works": "CitizenMate uses a scientifically proven spaced repetition algorithm (SM-2) to schedule each question's review at the optimal moment for memory retention. Questions you struggle with appear more often, while mastered questions appear less frequently."
  }
}
```

### Vietnamese (`vi.json`)

```json
{
  "xai": {
    "interval_explanation": "Thời gian ôn tập tiếp theo được tính dựa trên lịch sử trả lời của bạn. Câu trả lời đúng làm tăng khoảng cách giữa các lần ôn tập, trong khi câu trả lời sai sẽ đưa câu hỏi trở lại sớm hơn. Khoảng cách này giúp chuyển kiến thức vào trí nhớ dài hạn.",
    "confidence_explanation": "Mức độ tự tin của bạn được xác định bằng cách bạn trả lời đúng liên tục bao nhiêu lần. Sự tự tin cao hơn đồng nghĩa với khoảng thời gian ôn tập dài hơn giữa các lần. Mỗi câu trả lời đúng liên tiếp sẽ củng cố điểm số tự tin của bạn.",
    "early_review": "Ôn tập một câu hỏi trước thời gian dự kiến có thể không cải thiện khả năng ghi nhớ hiệu quả bằng việc chờ đúng khung thời gian ôn tập tối ưu. Thuật toán SRS lên lịch mỗi lần ôn tập vào thời điểm lý tưởng để củng cố trí nhớ.",
    "late_review": "Nếu bạn bỏ lỡ một lần ôn tập theo lịch, câu hỏi sẽ trở nên quá hạn và sẽ được ưu tiên trong buổi học tiếp theo. Mặc dù thỉnh thoảng ôn tập muộn không sao, nhưng ôn tập đúng giờ liên tục sẽ xây dựng trí nhớ dài hạn mạnh nhất.",
    "how_srs_works": "CitizenMate sử dụng thuật toán lặp lại ngắt quãng đã được khoa học chứng minh (SM-2) để lên lịch ôn tập mỗi câu hỏi vào thời điểm tối ưu cho việc ghi nhớ. Các câu hỏi bạn trả lời sai sẽ xuất hiện thường xuyên hơn, trong khi các câu hỏi đã thành thạo xuất hiện ít hơn."
  }
}
```

### Spanish (`es.json`)

```json
{
  "xai": {
    "interval_explanation": "El tiempo de la próxima revisión se calcula en base a tu historial de rendimiento. Las respuestas correctas aumentan el intervalo entre revisiones, mientras que las respuestas incorrectas hacen que la pregunta vuelva antes. Este espaciado ayuda a transferir el conocimiento a la memoria a largo plazo.",
    "confidence_explanation": "Tu nivel de confianza se determina por la consistencia de tus respuestas correctas. Mayor confianza significa intervalos más largos entre revisiones. Cada respuesta correcta consecutiva fortalece tu puntuación de confianza.",
    "early_review": "Revisar una pregunta antes de su hora programada puede no mejorar la retención tan efectivamente como esperar la ventana de revisión óptima. El algoritmo SRS programa cada revisión en el momento ideal para la consolidación de la memoria.",
    "late_review": "Si te pierdes una revisión programada, la pregunta se retrasa y tendrá prioridad en tu próxima sesión. Aunque las revisiones tardías ocasionales están bien, las revisiones consistentes y puntuales construyen la memoria a largo plazo más fuerte.",
    "how_srs_works": "CitizenMate utiliza un algoritmo de repetición espaciada científicamente probado (SM-2) para programar la revisión de cada pregunta en el momento óptimo para la retención de memoria. Las preguntas con las que tienes dificultades aparecen con más frecuencia, mientras que las preguntas dominadas aparecen con menos frecuencia."
  }
}
```

---

## 3. Integration Points

### 3a. Smart Practice Session Page

**File:** `src/app/[lang]/practice/smart/session/page.tsx`

| Location | Context | i18n Key |
|----------|---------|----------|
| Feedback section (question rationale block) | After explanation text, next to book reference | `xai.interval_explanation` or `how_srs_works` |
| Bottom stats bar ("SRS active") | Next to the Brain icon | `xai.how_srs_works` |

### 3b. Smart Practice Landing Page

**File:** `src/app/[lang]/practice/smart/page.tsx`

| Location | Context | i18n Key |
|----------|---------|----------|
| SRS stats section | Next to mastery/reviewing indicators | `xai.confidence_explanation` |
| Weak areas section | Next to accuracy data | `xai.interval_explanation` |
| How Smart Practice works section | Adjacent to explanation text | `xai.how_srs_works` |

---

## 4. Implementation Plan

### Files to Create

1. `src/components/shared/xai-tooltip.tsx` — The XaiTooltip component

### Files to Modify

2. `src/i18n/dictionaries/en.json` — Add `xai` section
3. `src/i18n/dictionaries/vi.json` — Add `xai` section
4. `src/i18n/dictionaries/es.json` — Add `xai` section
5. `src/app/[lang]/practice/smart/session/page.tsx` — Add tooltip to feedback section
6. `src/app/[lang]/practice/smart/page.tsx` — Add tooltip to smart practice landing page
