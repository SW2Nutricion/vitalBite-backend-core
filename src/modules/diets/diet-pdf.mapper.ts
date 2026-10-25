import { DietMealItemModel } from './models/diet-meal-item.model';
import { DietMealModel } from './models/diet-meal.model';
import { DietPlanDayModel } from './models/diet-plan-day.model';
import { DietPlanModel } from './models/diet-plan.model';

export interface DietPdfPayload {
  requestId: string | null;
  generatedAt: string;
  output: {
    fileName: string;
    delivery: string;
    locale: string;
    timezone: string;
    showGenerationDate: boolean;
    showProfessionalSignature: boolean;
    footerText: string | null;
  };
  patient: {
    id: string;
    fullName: string;
  };
  dietPlan: {
    id: string;
    name: string;
    objective: string;
    phase: string | null;
    dailyCaloriesTarget: number;
  };
  week: {
    startDate: string | null;
    endDate: string | null;
    days: DietPdfDay[];
  };
  summary: {
    weeklyTargetCalories: number;
    weeklyConsumedCalories: number;
  };
}

export interface DietPdfDay {
  id: string;
  dayLabel: string;
  dayOrder: number;
  targetCalories: number;
  consumedCalories: number;
  meals: DietPdfMeal[];
}

export interface DietPdfMeal {
  id: string;
  name: string;
  mealOrder: number;
  time: string | null;
  targetCalories: number;
  consumedCalories: number;
  text: string;
}

export interface MapDietPlanToPdfPayloadOptions {
  requestId?: string;
  generatedAt?: Date;
  delivery?: string;
  locale?: string;
  timezone?: string;
  fileName?: string;
  showGenerationDate?: boolean;
  showProfessionalSignature?: boolean;
  footerText?: string;
}

export function mapDietPlanToPdfPayload(
  dietPlan: DietPlanModel,
  options: MapDietPlanToPdfPayloadOptions = {},
): DietPdfPayload {
  const weekDays = [...(dietPlan.days ?? [])]
    .sort((current, next) => current.dayOrder - next.dayOrder)
    .map((day) => mapDay(day));
  const weeklyTargetCalories = sumBy(
    weekDays,
    (day) => day.targetCalories,
  );
  const weeklyConsumedCalories = sumBy(
    weekDays,
    (day) => day.consumedCalories,
  );

  return {
    requestId: options.requestId ?? null,
    generatedAt: (options.generatedAt ?? new Date()).toISOString(),
    output: {
      fileName: options.fileName ?? buildFileName(dietPlan),
      delivery: options.delivery ?? 'download',
      locale: options.locale ?? 'es-CO',
      timezone: options.timezone ?? 'America/Bogota',
      showGenerationDate: options.showGenerationDate ?? true,
      showProfessionalSignature: options.showProfessionalSignature ?? true,
      footerText: options.footerText ?? null,
    },
    patient: {
      id: dietPlan.patientId,
      fullName: dietPlan.patientFullName,
    },
    dietPlan: {
      id: dietPlan.id,
      name: dietPlan.name,
      objective: dietPlan.objective,
      phase: dietPlan.phase ?? null,
      dailyCaloriesTarget: numberOrZero(dietPlan.estimatedCalories),
    },
    week: {
      startDate: toIsoDate(dietPlan.startDate),
      endDate: toIsoDate(dietPlan.endDate),
      days: weekDays,
    },
    summary: {
      weeklyTargetCalories,
      weeklyConsumedCalories,
    },
  };
}

function mapDay(day: DietPlanDayModel): DietPdfDay {
  const meals = [...(day.meals ?? [])]
    .sort((current, next) => current.mealOrder - next.mealOrder)
    .map((meal) => mapMeal(meal));

  return {
    id: day.id,
    dayLabel: day.dayLabel,
    dayOrder: day.dayOrder,
    targetCalories: sumBy(meals, (meal) => meal.targetCalories),
    consumedCalories: sumBy(meals, (meal) => meal.consumedCalories),
    meals,
  };
}

function mapMeal(meal: DietMealModel): DietPdfMeal {
  const items = [...(meal.items ?? [])]
    .sort((current, next) => current.itemOrder - next.itemOrder)
    .map((item) => mapItem(item));

  return {
    id: meal.id,
    name: meal.name,
    mealOrder: meal.mealOrder,
    time: meal.notes ?? null,
    targetCalories: numberOrZero(meal.targetCalories),
    consumedCalories: sumBy(items, (item) => item.calories),
    text:
      items.length > 0
        ? items
            .map((item) => `${item.name}${item.portion ? ` ${item.portion}` : ''}`)
            .join(' + ')
        : 'Sin alimentos registrados',
  };
}

function mapItem(item: DietMealItemModel) {
  return {
    name: item.name,
    portion: item.portion ?? null,
    calories: numberOrZero(item.calories),
  };
}

function buildFileName(dietPlan: DietPlanModel) {
  return slugify(`dieta-semanal-${dietPlan.patientFullName}-${dietPlan.phase ?? 'sin-fase'}.pdf`);
}

function toIsoDate(value?: Date | null) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

function numberOrZero(value?: number | null) {
  return Number(value) || 0;
}

function sumBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}
