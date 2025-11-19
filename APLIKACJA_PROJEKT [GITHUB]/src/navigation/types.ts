export type AuthStackParamList = {
	Login: undefined
	Register: undefined
}

export type AppTabParamList = {
	Home: undefined
	Add: undefined
	Stats: undefined
	Profile: undefined
}

export type HomeStackParamList = {
	GymsList: undefined
	GymRoutes: { gymId: string; gymName: string }
}
