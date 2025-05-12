import { Button } from "@ui/button";

export default function ScrollControls({
  showScrollMessage,
  isAtStart,
  isAtEnd,
  startScrollingUp,
  stopScrollingUp,
  startScrollingDown,
  stopScrollingDown,
}) {
  if (!showScrollMessage) return null;

  return (
    <div className="flex justify-center items-center py-2 gap-4">
      <div className="flex items-center gap-4">
        <div className="text-primary text-xl">Scroll for more</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="p-2 rounded-md transition-colors border-primary"
            onMouseDown={startScrollingDown}
            onMouseUp={stopScrollingDown}
            onMouseLeave={stopScrollingDown}
            onTouchStart={startScrollingDown}
            onTouchEnd={stopScrollingDown}
            onBlur={stopScrollingDown}
            disabled={isAtEnd}
            tabIndex={-1}
          >
            <div className="text-2xl text-primary hover:text-black">⩔</div>
          </Button>
          <Button
            variant="outline"
            className={`p-2 rounded-md transition-colors border-primary`}
            onMouseDown={startScrollingUp}
            onMouseUp={stopScrollingUp}
            onMouseLeave={stopScrollingUp}
            onTouchStart={startScrollingUp}
            onTouchEnd={stopScrollingUp}
            onBlur={stopScrollingUp}
            disabled={isAtStart}
            tabIndex={-1}
          >
            <div className="text-2xl text-primary transform rotate-180 hover:text-black">⩔</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
