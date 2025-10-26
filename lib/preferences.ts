"use client"

export const setPreference = (region: string) => {
    localStorage.setItem("preference-region", region);
    window.dispatchEvent(new Event('storage'));
}

export const getPreference = () => {
    return localStorage.getItem("preference-region");
}

export const removePreference = () => {
    localStorage.removeItem("preference-region");
    window.dispatchEvent(new Event('storage'));
}  