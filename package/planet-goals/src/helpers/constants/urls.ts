import { IRemovePlayer } from "../../types/game";

export const Footer = {
    conditionTerms: "/cdn/assets/PlanetGoals_Terms_of_Service.pdf",
    instagram: "https://www.instagram.com/planet_goals",
    linkedIn: "https://www.linkedin.com/company/104809294",
    privacyPolicy: "/cdn/assets/PlanetGoals_Privacy_Policy.pdf",
    youtube: "https://www.youtube.com/@PlanetGoals-SDGs",
};

export const Game = {
    gameplay: {
        sendAnswer: (gameId: string) => `/api/game/${gameId}/answer`,
    },
    management: {
        create: "/api/game",
        getLessonById: (lessonId: string) => `/api/lesson/${lessonId}`,
        join: "/api/game/join",
        removePlayer: ({ gameId, playerId }: IRemovePlayer) => `/api/game/${gameId}/remove-player/${playerId}`,
        start: (gameId: string) => `/api/game/${gameId}/start`,
    }
};

export const LandingPage = {
    blog: "https://planet-goals.eu",
    confirm: "/confirm",
    fillRegisterData: "/signup-finish",
    main: "/",
    signIn: "/signin",
    signUp: "/signup",
};

export const Main = {
    game: "/game",
    startLessons: "/lessons",
    lobby: "/lobby",
    myProgress: "/my-progress",
    materials: "/materials",
    myProfile: "/my-profile",
}

export const Socket = {
    namespace: "/socket.io",
    url: "/player",
}

export const User = {
    checkEmail: "/api/user/auth/login",
    confirm: "/api/user/auth/confirm",
    edit: "/api/user/auth/edit",
    me: "/api/user/auth/me",
    refreshToken: "/api/user/auth/refresh-token",
    signUp: "/api/user/auth/register",
    stats: "/api/user/stats",
};
