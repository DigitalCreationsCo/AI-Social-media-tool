import { Platform, Source } from "@/types/Social";

export const socialApiUrl = (platform: Source) => `/api/${platform}`;