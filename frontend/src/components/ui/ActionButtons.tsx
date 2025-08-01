import { Button } from "@/components/ui/button";
import { SolveGameDialog } from "@/components/SolveGameDialog";
import { useState } from "react";

export function ActionButtons({
  onSolve,
  onGiveUp,
  disabled
}: {
  onSolve: (guessedWords: string[]) => boolean;
  onGiveUp: () => void;
  disabled: boolean;
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="bg-[rgb(13,31,61,0.91)] p-6 rounded-none md:rounded-xl border border-slate-600 w-full md:max-w-md mx-auto flex flex-col gap-4 mt-6 ">
      <h3 className="text-white text-lg font-semibold text-center">Ações</h3>

      <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
   
      <Button
          className="flex-1 min-w-[100px] bg-red-600 hover:bg-red-700 text-white"
          variant="destructive"
          onClick={onGiveUp}
          disabled={disabled}
        >
          ❌ Desistir
        </Button>
        <Button
          className="flex-1 min-w-[100px] bg-yellow-600 hover:bg-yellow-700 text-white"
          disabled
        >
          ⏭️ skip
        </Button>
        <SolveGameDialog
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            onSolve={onSolve}
            disabled={disabled}
            >
            <Button
                className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700 text-white"
                disabled={disabled}
            >
                🧠 Responder
            </Button>
            </SolveGameDialog>
  
      </div>
    </div>
  );
}
