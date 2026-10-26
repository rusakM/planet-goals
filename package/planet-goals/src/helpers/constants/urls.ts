import { IRemovePlayer } from "../../types/game";
import { LocalesEnum } from "./translations";

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
        stop: (gameId: string) => `/api/game/${gameId}/stop`
    }
};

export const LandingPage = {
    blog: "https://planet-goals.eu",
    confirm: "/confirm",
    fillRegisterData: "/signup-finish",
    instruction: "/cdn/assets/manual/instructions",
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
};

export const Materials = {
    cdnMaterials: "/cdn/materials",
    getMaterials: "/api/materials",
};

export const Socket = {
    namespace: "/socket.io",
    url: "/player",
};

export const User = {
    checkEmail: "/api/user/auth/login",
    confirm: "/api/user/auth/confirm",
    edit: "/api/user/auth/edit",
    me: "/api/user/auth/me",
    refreshToken: "/api/user/auth/refresh-token",
    signUp: "/api/user/auth/register",
    stats: "/api/user/stats",
};

export const MANUALS_NAMES: { lang: LocalesEnum; filename: string }[] = [
  { lang: LocalesEnum.pl, filename: "Podręcznik warsztatów (PL).pdf" },
  { lang: LocalesEnum.en, filename: "Workshop Manual (EN).pdf" },
  { lang: LocalesEnum.es, filename: "Manual de directrices (ES).pdf" },
  { lang: LocalesEnum.it, filename: "Manuale per la realizzazione dei workshop (IT).pdf" },
  { lang: LocalesEnum.sl, filename: "Priročnik za izvajanje delavnic (SL).pdf" },
  { lang: LocalesEnum.nb, filename: "Verkstedsmanual (NO).pdf" },
  { lang: LocalesEnum.sv, filename: "Workshophandbok (SE).pdf" },
  { lang: LocalesEnum.el, filename: "Εγχειρίδιο Εργαστηρίου (EL).pdf" },
];