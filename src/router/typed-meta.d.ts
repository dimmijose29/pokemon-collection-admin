import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: Component
    requiresAuth?: boolean
    requiresGuest?: boolean
  }
}
