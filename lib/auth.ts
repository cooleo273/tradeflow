/**
 * Utility function to get the userId from localStorage or decode it from the JWT token
 */
export function getUserId(): string | null {
    if (typeof window === 'undefined') return null

    // First try to get from localStorage
    let userId = localStorage.getItem("userId")

    // If not in localStorage, try to decode from token
    if (!userId) {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]))
                userId = tokenPayload.sub || null

                // Store it for future use
                if (userId) {
                    localStorage.setItem("userId", userId)
                }
            } catch (err) {
                console.error("Failed to decode token:", err)
            }
        }
    }

    return userId
}
