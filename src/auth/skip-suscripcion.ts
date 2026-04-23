import { SetMetadata } from '@nestjs/common';
export const SKIP_SUSCRIPCION_KEY = 'skipSuscripcion';
export const SkipSuscripcion = () => SetMetadata(SKIP_SUSCRIPCION_KEY, true);