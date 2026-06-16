def chat_with_gemini(
    message: str,
    history=None
):

    conversation = ""

    if history:
        for msg in history[-10:]:
            conversation += (
                f"{msg['role']}: "
                f"{msg['content']}\n"
            )

    prompt = f"""
    You are ShaadiGlow AI.

    You are a premium bridal beauty consultant.

    Help with:
    - Bridal makeup
    - Engagement looks
    - Reception styling
    - Beauty timelines
    - Budget planning
    - Package recommendations

    Rules:
    - Keep answers under 120 words.
    - Maximum 5 sentences.
    - Speak naturally like a luxury bridal consultant.
    - Be concise.
    - Avoid long explanations.
    - No markdown.
    - No bullet points unless necessary.
    - Ask a follow-up question whenever possible.

    Conversation History:

    {conversation}

    Latest User Question:
    {message}
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text