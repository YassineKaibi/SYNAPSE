'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { currentUser } from '@/lib/data/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Settings, Bell, Languages, UserCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(currentUser.preferences)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Parametres
        </h1>
        <p className="text-muted-foreground">
          Configurez votre profil, vos notifications et la langue d&apos;interface.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences utilisateur</CardTitle>
            <CardDescription>
              Ces reglages sont precharges depuis le profil de {currentUser.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les mises a jour du Conseil et du Jumeau.
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, notifications: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Suggestions automatiques</p>
                  <p className="text-sm text-muted-foreground">
                    Laisser SYNAPSE proposer des actions au fil du PFE.
                  </p>
                </div>
                <Switch
                  checked={preferences.autoSuggest}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, autoSuggest: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Alertes proactives</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les alertes de stress et de momentum.
                  </p>
                </div>
                <Switch
                  checked={preferences.proactiveAlerts}
                  onCheckedChange={(checked) =>
                    setPreferences((prev) => ({ ...prev, proactiveAlerts: checked }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="font-medium">Langue</p>
              <div className="flex gap-2">
                <Button
                  variant={preferences.language === 'fr' ? 'default' : 'outline'}
                  onClick={() => setPreferences((prev) => ({ ...prev, language: 'fr' }))}
                >
                  Francais
                </Button>
                <Button
                  variant={preferences.language === 'en' ? 'default' : 'outline'}
                  onClick={() => setPreferences((prev) => ({ ...prev, language: 'en' }))}
                >
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profil SYNAPSE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Notifications</span>
                <Badge variant={preferences.notifications ? 'default' : 'secondary'}>
                  {preferences.notifications ? 'Actives' : 'Desactivees'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Langue actuelle: {preferences.language === 'fr' ? 'Francais' : 'English'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
