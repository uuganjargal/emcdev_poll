import React, { useState, useEffect } from "react";



export const socket = socketio.connect(ENDPOINT);
export const SocketContext = React.createContext();

