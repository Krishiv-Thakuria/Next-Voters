"use client"

export const setPreference = (region: string) => {
    localStorage.setItem("preference-region", region);
}

export const getPreference = () => {
    return localStorage.getItem("preference-region");
}

export const removePreference = () => {
    localStorage.removeItem("preference-region");
}  