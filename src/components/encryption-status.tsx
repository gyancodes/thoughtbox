import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  isCryptoSupported,
  getEncryptionStatus,
  auditLogger,
  type EncryptionStatus as EncryptionStatusType,
  type SecurityEvent,
} from "@/lib/crypto";

interface EncryptionStatusPanelProps {
  isEnabled: boolean;
  onToggle?: () => void;
}

export function EncryptionStatusPanel({ isEnabled, onToggle }: EncryptionStatusPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [cryptoSupported] = useState(() => isCryptoSupported());
  const [status] = useState<EncryptionStatusType | null>(() => getEncryptionStatus());
  const [recentEvents] = useState<SecurityEvent[]>(() => auditLogger.getEvents().slice(-5));
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    // Check session status periodically
    const interval = setInterval(() => {
      setSessionActive(document.hasFocus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!cryptoSupported) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-medium">Encryption Not Supported</p>
            <p className="text-sm text-destructive/80">
              Your browser doesn't support Web Crypto API. Please use a modern browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
          )}
          <div className="text-left">
            <p className="font-semibold">
              {isEnabled ? "End-to-End Encryption Active" : "Encryption Disabled"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isEnabled
                ? "Your notes are encrypted before leaving your device"
                : "Enable encryption for zero-knowledge security"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEnabled && (
            <span className="px-2 py-1 bg-green-500/20 text-green-600 text-xs font-medium rounded-full">
              Protected
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-4">
              {/* Encryption Details */}
              {status && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Encryption Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs">Algorithm</span>
                      </div>
                      <p className="font-medium">{status.algorithm}</p>
                      <p className="text-xs text-muted-foreground">{status.keyLength}-bit</p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Key className="w-3 h-3" />
                        <span className="text-xs">Key Derivation</span>
                      </div>
                      <p className="font-medium">{status.kdf}</p>
                      <p className="text-xs text-muted-foreground">
                        {status.iterations.toLocaleString()} iterations
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Status */}
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Session Status</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    sessionActive
                      ? "bg-green-500/20 text-green-600"
                      : "bg-amber-500/20 text-amber-600"
                  }`}
                >
                  {sessionActive ? "Active" : "Idle"}
                </span>
              </div>

              {/* Security Events */}
              {recentEvents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Recent Security Events</h4>
                  <div className="space-y-1">
                    {recentEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs p-2 bg-secondary/30 rounded"
                      >
                        {event.success ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-destructive" />
                        )}
                        <span className="flex-1 capitalize">{event.type.replace("_", " ")}</span>
                        <span className="text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {onToggle && (
                  <Button
                    variant={isEnabled ? "destructive" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={onToggle}
                  >
                    {isEnabled ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Disable Encryption
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Enable Encryption
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center">
                Zero-knowledge architecture: We cannot access your notes or encryption keys.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Compact encryption indicator for toolbar/status bar
 */
export function EncryptionIndicator({ isEnabled }: { isEnabled: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
        isEnabled
          ? "bg-green-500/20 text-green-600"
          : "bg-amber-500/20 text-amber-600"
      }`}
      title={isEnabled ? "End-to-end encryption active" : "Encryption disabled"}
    >
      {isEnabled ? (
        <>
          <Lock className="w-3 h-3" />
          <span>Encrypted</span>
        </>
      ) : (
        <>
          <Unlock className="w-3 h-3" />
          <span>Unencrypted</span>
        </>
      )}
    </div>
  );
}
