import type { Wheel } from "./wheel";

export type WheelAssignment = {
  id: number;
  member_id: number;
  wheel_id: number;
  wheel: Wheel;
  assigned_at: Date;
} 