import { createContext, useReducer } from 'react'

const initialState = {
  showInfoBox: true,
  showMapLayers: false,
  mapLayer: null,
  selectedHotspot: null,
  selectedTxn: null,
  geolocation: {
    currentPosition: { timestamp: 0 },
    isLoading: false,
  },
}

const store = createContext(initialState)
const { Provider } = store

export const TOGGLE_INFO_BOX = 'TOGGLE_INFO_BOX'
export const TOGGLE_MAP_LAYERS = 'TOGGLE_MAP_LAYERS'
export const SET_MAP_LAYER = 'SET_MAP_LAYER'
export const SET_SELECTED_HOTSPOT = 'SET_SELECTED_HOTSPOT'
export const SET_SELECTED_TXN = 'SET_SELECTED_TXN'
export const SET_CURRENT_POSITION_LOADING = 'SET_CURRENT_POSITION_LOADING'
export const SET_CURRENT_POSITION = 'SET_CURRENT_POSITION'

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    console.log(action)
    switch (action.type) {
      case TOGGLE_INFO_BOX:
        return { ...state, showInfoBox: !state.showInfoBox }
      case TOGGLE_MAP_LAYERS:
        return { ...state, showMapLayers: !state.showMapLayers }
      case SET_MAP_LAYER:
        return { ...state, showMapLayers: false, mapLayer: action.payload }
      case SET_SELECTED_HOTSPOT:
        return { ...state, selectedHotspot: action.payload }
      case SET_SELECTED_TXN:
        return { ...state, selectedTxn: action.payload }
      case SET_CURRENT_POSITION_LOADING:
        return {
          ...state,
          geolocation: {
            ...state.geolocation,
            isLoading: action.payload || true,
          },
        }
      case SET_CURRENT_POSITION:
        return {
          ...state,
          geolocation: { currentPosition: action.payload, isLoading: false },
        }
      default:
        throw new Error()
    }
  }, initialState)

  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { store, StateProvider }
