
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lightbulb } from "lucide-react";

interface SolveGameDialogProps {
  onSolve: (words: string[]) => boolean;
  disabled?: boolean;
}

export function SolveGameDialog({ onSolve, disabled }: SolveGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [word3, setWord3] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!word1.trim() || !word2.trim() || !word3.trim()) return;
    
    setIsSubmitting(true);
    const success = onSolve([word1, word2, word3]);
    
    if (success) {
      setOpen(false);
      setWord1("");
      setWord2("");
      setWord3("");
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setOpen(false);
    setWord1("");
    setWord2("");
    setWord3("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500"
          disabled={disabled}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Resolver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-white">Resolver o Jogo</DialogTitle>
          <DialogDescription className="text-slate-400">
            Digite as 3 palavras que você acha que são a resposta. Se todas estiverem corretas, você vence imediatamente!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="word1" className="text-white">Primeira palavra:</Label>
            <Input
              id="word1"
              value={word1}
              onChange={(e) => setWord1(e.target.value)}
              placeholder="Digite a primeira palavra"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="word2" className="text-white">Segunda palavra:</Label>
            <Input
              id="word2"
              value={word2}
              onChange={(e) => setWord2(e.target.value)}
              placeholder="Digite a segunda palavra"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="word3" className="text-white">Terceira palavra:</Label>
            <Input
              id="word3"
              value={word3}
              onChange={(e) => setWord3(e.target.value)}
              placeholder="Digite a terceira palavra"
              className="bg-slate-700 border-slate-600 text-white"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!word1.trim() || !word2.trim() || !word3.trim() || isSubmitting}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isSubmitting ? "Verificando..." : "Resolver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
