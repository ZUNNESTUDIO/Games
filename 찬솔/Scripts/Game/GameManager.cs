using UnityEngine;

public class GameManager : MonoBehaviour
{
    public int winStreak;

    public void RegisterWin()
    {
        winStreak++;
        DifficultyManager.AdjustDifficulty(winStreak);
        MoneySystem.AddWinReward(winStreak);
    }

    public void ResetProgress()
    {
        winStreak = 0;
        DifficultyManager.AdjustDifficulty(winStreak);
    }
}
