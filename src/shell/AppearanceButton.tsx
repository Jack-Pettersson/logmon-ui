import { Palette } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/button.tsx';
import { Dialog, Tooltip } from '../components/overlay.tsx';
import { ThemePicker } from '../theme/ThemePicker.tsx';

export function AppearanceButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content="Appearance">
        <Button variant="ghost" size="icon" aria-label="Appearance" onClick={() => setOpen(true)}>
          <Palette />
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Appearance"
        description="Applies across logmon on this browser."
        className="max-w-xl"
      >
        <ThemePicker />
      </Dialog>
    </>
  );
}
