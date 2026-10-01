// ============================================================
// A SQUARE L INNOVATE — Supabase Configuration
// Loads the Supabase SDK and exposes the client globally.
//
// IMPORTANT: This file must NOT touch window.ASLDS — it runs
// BEFORE app.js and would shadow the ASLDS runtime.
//
// NOTE: The anon key is safe to expose in the browser — Row Level
// Security on the database protects user data.
// ============================================================

(function (window, document) {
    'use strict';

    const SUPABASE_URL = 'https://rrrojvvlflfitnxievob.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycm9qdnZsZmxmaXRueGlldm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MzI0MDUsImV4cCI6MjEwNjIwODQwNX0.0MX1ZFWnXS59Qf0RU0ZykBNio6viUBSiS1JmA4yMMP0';

    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error('[Supabase] SDK not loaded. Add the CDN script BEFORE this file.');
        return;
    }

    window.SupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'asl-auth'
        }
    });

    console.info('[Supabase] Client ready for', SUPABASE_URL);

})(window, document);