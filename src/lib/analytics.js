/**
 * analytics.js — helpers for P2 dashboard, trending, and analytics.
 * Uses only data already stored in localStorage (userData from storage.js).
 * No external libraries.
 */

import { topics, getQuestionBank } from "./topics";
import {
  getQuestionIdForProgress,
  isQuestionCurrentlyFailed,
} from "../smartQuestionSelector";

// ─── Streak ───────────────────────────────────────────────────────────────────
/**
 * Returns streak emoji based on consecutive completed tests.
 */
export function getStreakEmoji(streak) {
  if (streak >= 6) return "🚀";
  if (streak >= 3) return "🔥";
  return "😐";
}

// ─── Weekly bar data ──────────────────────────────────────────────────────────
/**
 * Returns an array of 7 objects [{label, correct, incorrect, total}]
 * for the last 7 calendar days (today = index 6).
 */
export function getWeeklyStats(history) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("es-ES", { weekday: "short" }),
      dateStr: d.toISOString().slice(0, 10),
      correct: 0,
      incorrect: 0,
      total: 0,
    };
  });

  (history ?? []).forEach((session) => {
    const sessionDate = session.completedAt?.slice(0, 10);
    const day = days.find((d) => d.dateStr === sessionDate);
    if (!day) return;
    day.correct += session.correct ?? 0;
    day.incorrect += session.incorrect ?? 0;
    day.total += session.answered ?? 0;
  });

  return days;
}

// ─── Today stats ─────────────────────────────────────────────────────────────
export function getTodayStats(history) {
  const today = new Date().toISOString().slice(0, 10);
  return (history ?? [])
    .filter((s) => s.completedAt?.slice(0, 10) === today)
    .reduce(
      (acc, s) => ({
        tests: acc.tests + 1,
        correct: acc.correct + (s.correct ?? 0),
        answered: acc.answered + (s.answered ?? 0),
      }),
      { tests: 0, correct: 0, answered: 0 }
    );
}

// ─── Weakest topic ────────────────────────────────────────────────────────────
/**
 * Returns the topic with the lowest mastery that has at least 1 answered question.
 * Falls back to first available topic.
 */
export function getWeakestTopic(progress) {
  let weakest = null;
  let minMastery = Infinity;

  topics.forEach((topic) => {
    const bank = getQuestionBank(topic.id);
    if (!bank.length) return;

    let answered = 0;
    let correct = 0;
    bank.forEach((q) => {
      const p = progress[getQuestionIdForProgress(q)];
      if (p?.vecesVista > 0) {
        answered++;
        correct += p.vecesAcertada ?? 0;
      }
    });
    if (!answered) return;
    const mastery = Math.round((correct / answered) * 100);
    if (mastery < minMastery) {
      minMastery = mastery;
      weakest = { topic, mastery };
    }
  });

  if (!weakest) {
    // no answered questions yet — return topic with most failed questions
    const topicsWithFailed = topics
      .map((topic) => {
        const bank = getQuestionBank(topic.id);
        const failed = bank.filter((q) =>
          isQuestionCurrentlyFailed(progress[getQuestionIdForProgress(q)])
        ).length;
        return { topic, failed };
      })
      .filter((t) => t.failed > 0)
      .sort((a, b) => b.failed - a.failed);
    if (topicsWithFailed.length) {
      weakest = { topic: topicsWithFailed[0].topic, mastery: 0 };
    }
  }

  return weakest;
}

// ─── Hard questions ───────────────────────────────────────────────────────────
/**
 * Returns top N questions sorted by failure count.
 */
export function getHardQuestions(progress, limit = 5) {
  const items = [];
  topics.forEach((topic) => {
    getQuestionBank(topic.id).forEach((q) => {
      const pid = getQuestionIdForProgress(q);
      const p = progress[pid];
      if (!p) return;
      const failures = (p.vecesVista ?? 0) - (p.vecesAcertada ?? 0);
      if (failures > 0) {
        items.push({ question: q, topic, failures, p });
      }
    });
  });
  return items.sort((a, b) => b.failures - a.failures).slice(0, limit);
}

// ─── Accuracy trending ────────────────────────────────────────────────────────
/**
 * Returns { trend: "up"|"down"|"stable", accuracyByDay }
 * from the last 7 days history.
 */
export function getAccuracyTrend(history) {
  const week = getWeeklyStats(history);
  const withData = week.filter((d) => d.total > 0);
  if (withData.length < 2) return { trend: "stable", week };

  const first = withData[0];
  const last = withData[withData.length - 1];
  const firstAcc = first.total ? (first.correct / first.total) * 100 : 0;
  const lastAcc = last.total ? (last.correct / last.total) * 100 : 0;

  const diff = lastAcc - firstAcc;
  const trend = diff > 3 ? "up" : diff < -3 ? "down" : "stable";
  return { trend, week };
}

// ─── Global mastery ───────────────────────────────────────────────────────────
export function getGlobalMasteryFromProgress(progress) {
  let total = 0;
  let answered = 0;
  let correct = 0;
  topics.forEach((topic) => {
    getQuestionBank(topic.id).forEach((q) => {
      const p = progress[getQuestionIdForProgress(q)];
      total++;
      if (p?.vecesVista > 0) {
        answered++;
        correct += p.vecesAcertada ?? 0;
      }
    });
  });
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}
