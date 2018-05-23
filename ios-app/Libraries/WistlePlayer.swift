//
//  WistlePlayer.swift
//  GuardTrak
//
//  Created by niteshgoel on 1/29/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import Foundation
import AVFoundation
var player: AVAudioPlayer?
func playSound() {
    guard let url = Bundle.main.url(forResource: "soundName", withExtension: "mp3") else { return }
    
    do {
        try AVAudioSession.sharedInstance().setCategory(AVAudioSessionCategoryPlayback)
        try AVAudioSession.sharedInstance().setActive(true)
        
        
        player = try AVAudioPlayer(contentsOf: url)
        guard let player = player else { return }
        
        player.play()
        
    } catch let error {
        print(error.localizedDescription)
    }
}
