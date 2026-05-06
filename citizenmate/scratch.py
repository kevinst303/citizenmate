import json
import urllib.request
import urllib.parse
import os
from textwrap import dedent

data = [
    {
        "id": "b40e7913-c1ed-4b49-bb85-a636009d4175",
        "content": """
When it comes to the Australian Citizenship Test, the traditional way of studying—reading the *Our Common Bond* booklet repeatedly from start to finish—is the most inefficient method possible.

Most applicants have a natural affinity for certain topics. You might easily memorize the dates of colonization or the history of the First Fleet, but completely struggle to grasp the difference between a plebiscite and a referendum.

If you spend 10 hours studying, and 7 of those hours are spent reading History (which you already know) and only 3 are spent on Law (which you keep failing), you are wasting your time and risking failure. 

To pass quickly and confidently, you need to study **smarter, not harder**. This is exactly where the **CitizenMate AI** steps in to revolutionize your test prep.

## The Flaw of Generic Practice Tests

Free practice apps and online quizzes select questions completely at random. Sometimes you'll get 5 History questions, sometimes you'll get 5 Values questions.

When you take a generic 20-question quiz and score 80%, you feel good. But that 80% hides a dangerous truth: what if the 4 questions you got wrong were all Australian Values questions? On the real test, that is an automatic fail. 

A generic score does not tell you *why* you failed or *where* you need to focus.

## How the CitizenMate Algorithm Works

CitizenMate does not select questions randomly. Our advanced backend tracks every single click, answer, and mistake you make across hundreds of practice queries. 

Here is how our AI ensures you are 100% prepared:

### 1. The Diagnostic Phase
When you first start using CitizenMate, the system feeds you a controlled baseline of questions across all three testable categories (Australia and its People, Democratic Beliefs/Values, and Government/Law). 

The algorithm maps your baseline knowledge. It immediately flags that you are scoring 95% in History but only 40% in Government.

### 2. The Weakness Targeting Protocol
Once the system knows you struggle with Government and Law, it dynamically adjusts your future quizzes. 

Instead of feeding you more History questions, the AI will heavily skew your next quizzes to focus specifically on the roles of the Prime Minister, the Governor-General, and the three levels of government. It forces you to confront the exact topics that would have caused you to fail the real exam.

<QuizCTA 
  title="Stop Studying Blindly" 
  text="Let the CitizenMate algorithm do the heavy lifting. Our dashboard provides a real-time 'Readiness Score' across every individual topic, so you know exactly what to study today." 
/>

### 3. The 'Australian Values' Firewall

Because the Australian Values section carries a strict zero-tolerance failure rule, the CitizenMate AI institutes a firewall. 

You cannot achieve a "100% Test Ready" status on our platform until the algorithm verifies you have consistently answered a massive pool of Values questions flawlessly. If you miss a single Values question regarding "freedom of speech" or "equality of opportunity," the system logs that specific phrase and will relentlessly test you on it over the coming days until it becomes muscle memory.

## 4. Time Optimization

By forcing you to focus explicitly on your weak points, CitizenMate cuts your required study time in half. 

You no longer need to spend 3 hours reading the entire booklet. You can simply log in for 15 minutes a day, let the AI serve up a customized quiz consisting *only* of your weak areas, and log off knowing every single minute was spent productively.

Don't gamble your application fee on random free quizzes. Use CitizenMate to analytically dismantle your weak spots and walk into the Department of Home Affairs with total numerical confidence.
"""
    },
    {
        "id": "e7955d95-98ec-46d3-8279-47d4bfbb568f",
        "content": """
In late 2020, the Department of Home Affairs fundamentally altered the Australian Citizenship Test. They introduced a dedicated section focusing exclusively on **Australian Values**. 

With this introduction came a brutal, uncompromising new rule: **You must achieve a 100% score on the 5 mandatory Australian Values questions to pass the exam.**

If you correctly identify every single historical date, name every state capital, define the role of the Governor-General, and list every Aboriginal flag color—scoring 19 out of 20—but your one mistake was a Values question, **you fail**. 

The zero-tolerance policy has made this section the primary reason applicants fail. Here is exactly how to guarantee a 100% score on the Australian Values section.

## 1. Do Not Rely on "Common Sense"

The most dangerous assumption applicants make is that Australian values are simply global "common sense." They skim the booklet, assuming that "being a good person" is enough to guess the correct multiple-choice answer.

This is a fatal error.

The test does not measure your general morality; it measures your precise knowledge of how *Our Common Bond* explicitly defines Australian Values. 

For example, when asked about "freedom of speech," you might assume it means you can say whatever you want without consequence. But the test explicitly asks you to identify the *limits* of freedom of speech (e.g., inciting violence, defamation, or endangering national security). If you rely on your own interpretation of "freedom" instead of the booklet's strict legal definition, you will select the wrong option and instantly fail.

## 2. Memorize the Five Core Pillars

The *Our Common Bond* booklet categorizes Australian Values into distinct pillars. To guarantee a perfect score, you must actively memorize how the booklet defines each of these:

1. **Respect for the equal worth, dignity, and freedom of the individual:** You must know that this includes freedom of speech, religion, and association, but also involves mutual respect.
2. **Freedom of Speech and Freedom of Expression:** Understand the boundary between free speech and inciting violence or breaking the law.
3. **Freedom of Association:** You are free to join—or refuse to join—any legal organization, including a political party or a trade union.
4. **Freedom of Religion and Secular Government:** The government is secular, meaning it has no official religion and treats all citizens equally regardless of their faith (or lack thereof). Religious laws do not override Australian law.
5. **Equality of Men and Women / Equality of Opportunity:** Discriminatory practices, regardless of cultural background, are illegal. The law applies equally to everyone, regardless of gender, race, or religion.
6. **Peacefulness and the Rule of Law:** Change occurs through peaceful democratic processes, not violence. Everyone is subject to the law.
7. **Mateship and a "Fair Go":** A spirit of egalitarianism, mutual respect, and helping those in need, especially in times of crisis.

<QuizCTA 
  title="Drill the Exact Values Terms" 
  text="Stop guessing based on common sense. CitizenMate features extremely rigorous Australian Values focus modes. We simulate the exact phrasing of the real exam so you never get caught out by a subtle wording difference." 
/>

## 3. Practice Applying Values to Scenarios

The government test frequently asks you to apply these values to real-world scenarios. 

* **Scenario:** A colleague tells you that you must join a specific trade union to work at their factory. Is this legal in Australia?
* **Application:** No, because under *Freedom of Association*, you cannot be forced to join an organization.

If you have only memorized the bullet points but have never practiced applying them to scenarios, you will panic during the 45-minute timer. 

## 4. Beware of "Almost Right" Answers

Because the Values section carries a zero-tolerance policy, the multiple-choice options are written meticulously. You will often face two options that seem perfectly reasonable. 

* Option A will be a generally nice statement.
* Option B will be the exact phrase pulled directly from *Our Common Bond*.

You must select Option B. This is why reading the booklet multiple times and drilling with a hyper-realistic simulator like **CitizenMate** is non-negotiable. Only by repeatedly exposing yourself to the exact terminology used by the Australian Government can you confidently secure that required 100% score and proceed to your citizenship ceremony.
"""
    },
    {
        "id": "630bd41c-7f6a-4b2d-ac63-5b2d039202fd",
        "content": """
The Australian Citizenship Test is steeped in mystery. For most applicants, their only source of information regarding test day comes from vague government letters and highly anxious community forums. 

This lack of transparency breeds rumors. Applicants worry about "trick questions," spoken English tests, and intimidating interview officers. If you rely on hearsay, your anxiety will inevitably skyrocket.

To demystify the process and prepare you for reality, we are pulling back the curtain on the Australian Citizenship Test. Here is exactly what happens behind the scenes on test day.

## The Interview: It's Not a Spoken English Test

The biggest misconception surrounding the citizenship test is the "interview." 

Many applicants panic, assuming they will be seated across from an immigration officer and interrogated for 30 minutes in fluent English regarding Australian politics and history.

**The Reality:** The interview is merely a highly formal administrative check. 
You will be called up to an officer’s desk. They will ask you basic questions to confirm your identity, your current address, and verify the original documents you brought. They will also confirm your signature on the declaration form. 

This is technically an evaluation of your basic English comprehension—you must be able to understand their instructions and answer their identity questions natively—but it is *not* a hostile interrogation. It typically lasts less than 10 minutes.

## The Testing Room: Strictly Administered

Once your documents are verified, you will be directed into a dedicated testing room. 

**The Environment:** This room looks identical to a university computer lab. You are not allowed to bring personal belongings, mobile phones, or bags into the room; these must be stored in lockers outside. The room is heavily monitored by staff and security cameras to prevent cheating or the copying of questions.

**The Interface:** The government computer interface is remarkably sterile. It is a simple software program designed entirely for function over form.

* There is a large countdown timer in the corner starting at 45:00.
* You will see one multiple-choice question on the screen at a time, with three or four possible answers.
* You can click an answer and press "Next."
* You can flag questions to review later if you are unsure.
* You can navigate backward to review previous answers before submitting the final exam.

## The Automatic Generation of Questions

One of the most persistent myths is that "someone told me the questions they had, so I'll just study those." This is a fatal strategy.

**The Reality:** There is no single "citizenship test." The Department of Home Affairs maintains a massive, highly secure database containing hundreds of potential questions. 

When you log into your terminal, the computer connects to the server and instantly generates a completely unique test utilizing a strict algorithm:
1. It pulls 5 questions specifically from the pool regarding **Australian Values**.
2. It pulls the remaining 15 questions distributed across History (Australia and its People) and Government (Democracy and Law).

Because of this randomization, it is impossible to predict exactly what you will be asked. You must possess a comprehensive understanding of the entire *Our Common Bond* booklet to pass. 

<QuizCTA 
  title="Experience the Real Testing Environment" 
  text="CitizenMate's platform identical to the sterile, timed format of the official government computer lab. Practice until test day feels like just another routine exercise." 
/>

## Immediate Results

The most positive aspect of the testing procedure is the immediacy of the results. 

The moment you click "Submit Test," the computer instantly scores your exam. The screen will flash your percentage score and immediately inform you whether you have Passed or Failed. There is no agonizing days-long wait for a letter in the mail determining your fate. 

If you pass, you quietly inform the testing officer, receive your confirmation paperwork, and wait for your citizenship ceremony invitation. If you fail, you calmly request to re-sit the exam if possible, or leave to book another appointment.

The Australian Citizenship Test is not designed to trick you or terrify you. It is a highly structured, sterile administrative procedure. By preparing using an accurate, professional simulator like **CitizenMate**, you remove all the mystery of the exam, transforming test day from a nightmare into a straightforward victory lap.
"""
    }
]

import re
def simple_markdown_to_html(text):
    # Paragraphs
    lines = text.strip().split('\n')
    out = []
    in_list = False
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Headings
        if line.startswith('### '):
            line = f'<h3>{line[4:]}</h3>'
        elif line.startswith('## '):
            line = f'<h2>{line[3:]}</h2>'
        # Lists
        elif line.startswith('* ') or re.match(r'^\d+\. ', line):
            if not in_list:
                out.append('<ul>')
                in_list = True
            if line.startswith('* '):
                line = f'<li>{line[2:]}</li>'
            else:
                line = re.sub(r'^\d+\. ', '', line)
                line = f'<li>{line}</li>'
        else:
            if in_list and not line.startswith('<QuizCTA'):
                out.append('</ul>')
                in_list = False
            if not line.startswith('<QuizCTA'):
                line = f'<p>{line}</p>'
            
        out.append(line)
        
    if in_list:
        out.append('</ul>')
    
    html = '\n'.join(out)
    
    # Bold and italics
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    # Fix QuizCTA parsing issues
    html = html.replace('<em>Our Common Bond</em>', '<em>Our Common Bond</em>')
    return html

for item in data:
    html = simple_markdown_to_html(item['content'])
    sql = f"UPDATE blog_translations SET content = '{html.replace(chr(39), chr(39)+chr(39))}' WHERE id = '{item['id']}';"
    print(sql)
