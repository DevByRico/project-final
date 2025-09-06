// src/authStore.js
import { useSyncExternalStore } from 'react'

let _token = sessionStorage.getItem('token') || null
const listeners = new Set()
const notify = () => listeners.forEach(l => l())

export function getToken() { return _token }

export function setToken(next) {
  _token = next || null
  if (_token) {
    sessionStorage.setItem('token', _token)
  } else {
    sessionStorage.removeItem('token')
    localStorage.removeItem('token') // städa ev. gammalt
  }
  notify()
}

export function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function useToken() {
  return useSyncExternalStore(subscribe, getToken, getToken)
}
