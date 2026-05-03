import { Injectable, computed, signal } from '@angular/core';
import { CrimeService } from '../services/crime.service';

export interface CrimeRecord {
  _id?: string;
  crimeType?: string;
  crimeTitle?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  status?: string;
  dateOfCrime?: string | Date | null;
  reportedBy?: any;
  assignedOfficer?: any;
  aiRisk?: 'low' | 'medium' | 'high' | 'unknown' | null;
  aiConfidence?: number | null;
  aiAnalysis?: string | null;
  [key: string]: any;
}

interface CrimeListState {
  items: CrimeRecord[];
  loading: boolean;
  error: string | null;
  loadedAt: number | null;
}

const EMPTY: CrimeListState = {
  items: [],
  loading: false,
  error: null,
  loadedAt: null,
};

// Holds the "all crimes" list and the "my reports" list as separate signals
// so the dashboard and citizen views can subscribe independently.
@Injectable({ providedIn: 'root' })
export class CrimeStore {
  private readonly all = signal<CrimeListState>(EMPTY);
  private readonly mine = signal<CrimeListState>(EMPTY);

  readonly allCrimes = computed(() => this.all().items);
  readonly allLoading = computed(() => this.all().loading);
  readonly allError = computed(() => this.all().error);

  readonly myCrimes = computed(() => this.mine().items);
  readonly myLoading = computed(() => this.mine().loading);
  readonly myError = computed(() => this.mine().error);

  readonly totalCount = computed(() => this.all().items.length);

  readonly statusCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const c of this.all().items) {
      const key = (c.status ?? 'UNKNOWN').toUpperCase();
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  });

  constructor(private readonly crimes: CrimeService) {}

  loadAll(force = false) {
    if (!force && this.all().loading) return;
    this.all.update((s) => ({ ...s, loading: true, error: null }));
    this.crimes.getAllCrimes().subscribe({
      next: (items) =>
        this.all.set({ items: items ?? [], loading: false, error: null, loadedAt: Date.now() }),
      error: (err) =>
        this.all.update((s) => ({
          ...s,
          loading: false,
          error: err?.error?.message ?? 'Failed to load crimes',
        })),
    });
  }

  loadMine(force = false) {
    if (!force && this.mine().loading) return;
    this.mine.update((s) => ({ ...s, loading: true, error: null }));
    this.crimes.getMyCrimes().subscribe({
      next: (items) =>
        this.mine.set({ items: items ?? [], loading: false, error: null, loadedAt: Date.now() }),
      error: (err) =>
        this.mine.update((s) => ({
          ...s,
          loading: false,
          error: err?.error?.message ?? 'Failed to load reports',
        })),
    });
  }

  applyStatusUpdate(id: string, status: string) {
    const update = (state: CrimeListState): CrimeListState => ({
      ...state,
      items: state.items.map((c) => (c._id === id ? { ...c, status } : c)),
    });
    this.all.update(update);
    this.mine.update(update);
  }

  applyAssignment(id: string, officerId: string) {
    const update = (state: CrimeListState): CrimeListState => ({
      ...state,
      items: state.items.map((c) =>
        c._id === id ? { ...c, assignedOfficer: officerId } : c,
      ),
    });
    this.all.update(update);
  }

  reset() {
    this.all.set(EMPTY);
    this.mine.set(EMPTY);
  }
}
