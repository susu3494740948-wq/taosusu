import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ViewRole = 'customer' | 'merchant'

interface RoleState {
  role: ViewRole
  setRole: (role: ViewRole) => void
}

/** 顾客 / 商家双视图切换，仅保存在本机，不参与云端同步 */
export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'customer',
      setRole: (role) => set({ role }),
    }),
    {
      name: 'taosusu-view-role',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export const roleLabels: Record<ViewRole, string> = {
  customer: '顾客模式',
  merchant: '商家模式',
}
