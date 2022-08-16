export interface AccessToken {
  accessToken: string;
  domain: string;
  path: string;
  httpOnly: boolean;
  maxAge: number;
}

export interface RefreshToken {
  refreshToken: string;
  domain: string;
  path: string;
  httpOnly: boolean;
  maxAge: number;
}

export interface Option {
  accessOption: {
    domain: string;
    path: string;
    httpOnly: boolean;
    maxAge: number;
  };
  refreshOption: {
    domain: string;
    path: string;
    httpOnly: boolean;
    maxAge: number;
  };
}
