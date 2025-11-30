using UnityEngine;

public class IntroText : MonoBehaviour
{
    public GameObject introPanel;

    void Update()
    {
        if (introPanel != null && introPanel.activeSelf && Input.GetKeyDown(KeyCode.Return))
        {
            introPanel.SetActive(false);
        }
    }
}
