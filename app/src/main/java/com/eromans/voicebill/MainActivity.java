package com.eromans.voicebill;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.speech.RecognizerIntent;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;

public class MainActivity extends Activity {
    private static final int REQ_VOICE = 101;
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);
        web.setWebViewClient(new WebViewClient());
        web.addJavascriptInterface(new Bridge(), "Android");
        web.loadUrl("file:///android_asset/index.html");
    }

    private void js(final String code) {
        runOnUiThread(() -> web.evaluateJavascript(code, null));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_VOICE) return;
        String text = "";
        if (resultCode == RESULT_OK && data != null) {
            ArrayList<String> r = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            if (r != null && !r.isEmpty()) text = r.get(0);
        }
        js("window.onVoice(" + JSONObject.quote(text) + ")");
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onBack && window.onBack()", value -> {
            if (!"true".equals(value)) MainActivity.super.onBackPressed();
        });
    }

    private class Bridge {
        @JavascriptInterface
        public void startVoice() {
            runOnUiThread(() -> {
                Intent i = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ta-IN");
                i.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "ta-IN");
                i.putExtra(RecognizerIntent.EXTRA_PROMPT, "பில் விவரம் சொல்லுங்கள்…");
                try {
                    startActivityForResult(i, REQ_VOICE);
                } catch (ActivityNotFoundException e) {
                    js("window.onVoiceError(" + JSONObject.quote("Google voice இல்லை — Google app-ஐ install/update செய்யுங்கள்") + ")");
                }
            });
        }

        @JavascriptInterface
        public void printBill(final String name) {
            runOnUiThread(() -> {
                PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                PrintDocumentAdapter ad = web.createPrintDocumentAdapter(name);
                pm.print(name, ad, new PrintAttributes.Builder()
                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
            });
        }

        @JavascriptInterface
        public void shareImage(String b64, String fileName, String phone) {
            try {
                File dir = new File(getCacheDir(), "bills");
                if (!dir.exists()) dir.mkdirs();
                File f = new File(dir, fileName);
                FileOutputStream out = new FileOutputStream(f);
                out.write(Base64.decode(b64, Base64.DEFAULT));
                out.close();
                Uri uri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                Intent send = new Intent(Intent.ACTION_SEND);
                send.setType("image/png");
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(Intent.createChooser(send, "Bill அனுப்பு"));
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Share error: " + e.getMessage(), Toast.LENGTH_LONG).show());
            }
        }
    }
}
