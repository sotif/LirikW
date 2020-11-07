export interface AuthResponse {
  name: string;
  displayName: string;
  id: number;
  profilePictureUri: string;
  jwt: string;
}

export interface TwitchUser {
  name: string;
  displayName: string;
  id: number;
  profilePictureUri: string;
}

const authToTwitchUser = (auth: AuthResponse): TwitchUser  => ({
  name: auth.name,
  displayName: auth.displayName,
  id: auth.id,
  profilePictureUri: auth.profilePictureUri
});

export {authToTwitchUser};
