"""Console-based interactive script for the '제목없는 게임'.

Players pick a difficulty (3, 7, or 10) and progress through a short set of
scenes by pressing Enter to advance. The content mirrors the original student
storyboard while keeping the experience lightweight.
"""

import time
from typing import Dict, List

# 난이도별 게임 시나리오
GAME_SCENES: Dict[int, List[str]] = {
    3: [
        "🚪미로 입구\n주인공: '어디로 가지…?'\n동작: 이동키 ↔ 선택",
        "🔘퍼즐 등장\n주인공: '이 버튼 순서가 맞을까?'\n동작: 버튼 누르기",
        "👾보스 등장\n주인공: '앗, 공격이 느리네… 피하고 반격!'\n동작: 회피 + 공격",
        "🎉보스 격파\n주인공: '와, 클리어!'\n동작: 아이템 획득",
    ],
    7: [
        "🔄미로 입구 (회전 중)\n주인공: '방향 감각이…?!'\n동작: 이동키 ↔ 재빠르게 판단",
        "⚔️움직이는 칼날\n주인공: '어이쿠, 순간 판단!'\n동작: 점프 + 회피",
        "👾적 AI 공격\n주인공: '예측 불가, 피할 수 있을까…?'\n동작: 회피 반복",
        "💀레벨 끝 보스\n주인공: '한 방 맞으면 끝…!'\n동작: 슈퍼 집중 회피",
    ],
    10: [
        "🌪️미로 입구 (화면 흔들림)\n주인공: '뭐가 뭔지 하나도 모르겠어…!'\n동작: 이동키 + 감각 총동원",
        "🔀퍼즐+적 동시 등장\n주인공: '순서도 패턴도 없잖아!'\n동작: 순간 판단 + 스킬 연계",
        "⚡최종 보스 랜덤 출현\n주인공: '클리어 가능할까…?'\n동작: 회피 + 공격, 매 순간 위기",
        "❓보물 등장 여부 랜덤\n주인공: '이건… 신의 장난인가…'\n동작: 멘탈 붕괴 + 재도전",
    ],
}


def play_game(difficulty: int) -> None:
    """Run the game loop for the chosen difficulty."""

    scenes = GAME_SCENES.get(difficulty)
    if not scenes:
        print("선택한 난이도에 대한 시나리오가 없습니다. (3, 7, 10 중 선택)")
        return

    print(f"\n=== 난이도 {difficulty} 시나리오 시작 ===\n")
    for index, scene in enumerate(scenes, start=1):
        print(f"[컷{index}]\n{scene}\n")
        input("➡️ 동작키 입력 후 다음 컷 진행 (엔터)")
        print("\n" + "-" * 40 + "\n")
        time.sleep(0.5)

    print(f"=== 난이도 {difficulty} 시나리오 종료 ===\n")
    print("🏆 게임 클리어! 주인공 축하합니다! 🎉")


def choose_difficulty() -> int:
    """Prompt the user until a valid difficulty is chosen."""

    while True:
        try:
            difficulty = int(input("난이도를 선택하세요 (3/7/10): "))
        except ValueError:
            print("❌ 숫자로 입력해주세요.")
            continue

        if difficulty in GAME_SCENES:
            return difficulty
        print("❌ 3, 7, 10 중에서 선택해주세요.")


def main() -> None:
    """Entry point for the interactive game."""

    print("🎮 제목없는 게임에 오신 것을 환영합니다!")
    print("난이도 선택: 3=보통, 7=인간은 못 깸, 10=신")

    difficulty = choose_difficulty()
    play_game(difficulty)


if __name__ == "__main__":
    main()
