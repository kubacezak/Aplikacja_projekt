export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AddTabParamList = {
  routeId?: string;
  routeName?: string;
};

export type AppTabParamList = {
  Home: undefined;
  Add: AddTabParamList | undefined;
  Stats: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  GymsList: undefined;
  GymRoutes: {
    gymId: string;
    gymName: string;
  };
};
