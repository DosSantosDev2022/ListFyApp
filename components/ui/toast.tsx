import type React from 'react';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Animated, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react-native'; // Icons for different variants
import { cn } from "@/lib/utils"; // Your utility for NativeWind classes

type ToastVariant = 'default' | 'success' | 'destructive' | 'info';

interface ToastProps {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number; // in milliseconds
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, variant = 'default', duration = 3000, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in/out
  const slideAnim = useRef(new Animated.Value(-50)).current; // For slide-down from top

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          container: "bg-green-500", // A cor de fundo do seu Toast
          icon: CheckCircle,
          iconColor: "white",
        };
      case 'destructive':
        return {
          container: "bg-red-500",
          icon: XCircle,
          iconColor: "white",
        };
      case 'info':
        return {
          container: "bg-blue-500",
          icon: Info,
          iconColor: "white",
        };
      default:
        return {
          container: "bg-gray-800", // Ou bg-foreground ou outra cor padrão
          icon: Info,
          iconColor: "white",
        };
    }
  };

  const { container, icon: IconComponent, iconColor } = getVariantStyles();

  useEffect(() => {
    // Fade in and slide down
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        // Fade out and slide up
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onClose(id));
      }, duration);
      return () => clearTimeout(timer);
    });
  }, [fadeAnim, slideAnim, duration, id, onClose]);

  return (
    <Animated.View
      className={cn(
        "absolute top-10 left-0 right-0 p-4 mx-4 my-2 rounded-lg flex-row items-center gap-2",
        container
      )}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: 50, // Make sure it's on top
      }}
    >
      {IconComponent && <IconComponent size={20} color={iconColor} className="mr-2" />}
      <Text className="text-primary-foreground flex-1">{message}</Text>
    </Animated.View>
  );
};

// --- Context and Hook for Toast Management ---
interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const nextId = useRef(0);

  const showToast = (message: string, variant?: ToastVariant, duration?: number) => {
    const newId = (nextId.current++).toString();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: newId, message, variant, duration, onClose: handleCloseToast },
    ]);
  };

  const handleCloseToast = (idToClose: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== idToClose));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toastProps) => (
        <Toast key={toastProps.id} {...toastProps} />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};